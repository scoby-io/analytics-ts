import got from 'got';
import { buildUrl, IQueryParams } from 'build-url-ts';
import { createHmac } from 'crypto';
import { matches } from 'ip-matching';

export interface PageView {
  ipAddress: string;
  userAgent: string;
  requestedUrl: string;
  visitorId?: string;
  referringUrl?: string;
  visitorSegments?: string[];
}

export class Client {
  private readonly workspaceId: string;
  private readonly apiHost: string;
  private ipBlacklistPatterns: string[] = [];
  private whitelistedUrlParameters: string[] = [
    'utm_medium',
    'utm_source',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ];
  constructor(private apiKey: string, private readonly salt: string) {
    this.workspaceId = this.getWorkspaceId();
    this.apiHost = `https://${this.workspaceId}.s3y.io`;
  }

  private hash(value: string): string {
    const hmac = createHmac('sha256', this.salt);
    return hmac.update(Buffer.from(value, 'utf-8')).digest('hex');
  }

  private getVisitorId(pageView: PageView): string {
    const { visitorId, ipAddress, userAgent } = pageView;
    if (visitorId) {
      return this.hash([visitorId, this.workspaceId].join('|'));
    }

    return this.hash([ipAddress, userAgent, this.workspaceId].join('|'));
  }

  private getWorkspaceId(): string {
    const parts = Buffer.from(this.apiKey, 'base64')
      .toString('ascii')
      .split('|');
    if (parts.length > 0) {
      new Error('failed to extract workspaceId from apiKey');
    }
    return parts[0] as string;
  }

  private getRequestedUrl(requestedUrl: string): string {
    const url = new URL(requestedUrl);
    const { searchParams } = url;

    searchParams.forEach((_value, param) => {
      if (!this.whitelistedUrlParameters.includes(param)) {
        url.searchParams.delete(param);
      }
    });

    return url.toString();
  }

  private getReferringUrl(referringUrl: string): string {
    const url = new URL(referringUrl);
    return `${url.protocol}//${url.host}`;
  }

  public addWhitelistedUrlParameter(param: string): void {
    this.whitelistedUrlParameters.push(param);
  }

  public async logPageView(pageView: PageView): Promise<boolean> {
    const {
      userAgent,
      requestedUrl,
      referringUrl,
      ipAddress,
      visitorSegments,
    } = pageView;

    if (this.isBlockedIp(ipAddress)) {
      return false;
    }

    const queryParams: IQueryParams = {
      vid: this.getVisitorId(pageView),
      ua: userAgent,
      url: this.getRequestedUrl(requestedUrl),
    };

    if (referringUrl) {
      queryParams['ref'] = this.getReferringUrl(referringUrl);
    }

    if (visitorSegments) {
      queryParams['sg'] = visitorSegments.join(',');
    }

    const url = buildUrl(this.apiHost, {
      path: '/count',
      queryParams,
    });

    const options = {
      timeout: {
        send: 5000,
      },
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    const { statusCode } = await got(url, options).catch((error) => {
      throw new Error('failed to log page view' + error.message);
    });
    if (statusCode === 204) {
      return true;
    }
    throw new Error('failed to log page view. Status code: ' + statusCode);
  }

  private isBlockedIp(ipAddress: string): boolean {
    for (const pattern of this.ipBlacklistPatterns) {
      if (matches(ipAddress, pattern)) return true;
    }
    return false;
  }

  public blacklistIpRange(pattern: string) {
    this.ipBlacklistPatterns.push(pattern);
  }
}
