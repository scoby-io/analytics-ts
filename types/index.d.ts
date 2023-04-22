export interface PageView {
    ipAddress: string;
    userAgent: string;
    requestedUrl: string;
    visitorId?: string;
    referringUrl?: string;
    visitorSegments?: string[];
}
export declare class Client {
    private apiKey;
    private readonly salt;
    private readonly workspaceId;
    private readonly apiHost;
    private ipBlacklistPatterns;
    private whitelistedUrlParameters;
    constructor(apiKey: string, salt: string);
    private hash;
    private getVisitorId;
    private getWorkspaceId;
    private getRequestedUrl;
    private getReferringUrl;
    addWhitelistedUrlParameter(param: string): void;
    logPageView(pageView: PageView): Promise<boolean>;
    private isBlockedIp;
    blacklistIpRange(pattern: string): void;
}
//# sourceMappingURL=index.d.ts.map