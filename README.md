# Scoby Analytics: Typescript Client

[scoby](https://www.scoby.io) is an ethical analytics tool that helps you protect your visitors' privacy without sacrificing meaningful metrics. The data is sourced directly from your web server, no cookies are used and no GDPR, ePrivacy and Schrems II consent is required.

Start your free trial today [https://app.scoby.io/register](https://app.scoby.io/register)

#### Did you know?
scoby is free for non-profit projects.
[Claim your free account now](mailto:hello@scoby.io?subject=giving%20back)


[![Continuous Integrations](https://github.com/scobyio/analytics-ts/actions/workflows/continuous-integrations.yaml/badge.svg?branch=main)](https://github.com/scobyio/analytics-ts/actions/workflows/continuous-integrations.yaml)
[![License](https://badgen.net/github/license/scobyio/analytics-ts)](./LICENSE)
[![Package tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@scoby/analytics-ts)](https://bundlephobia.com/package/@scoby/analytics-ts)
[![Package minified & gzipped size](https://badgen.net/bundlephobia/minzip/@scoby/analytics-ts)](https://bundlephobia.com/package/@scoby/analytics-ts)
[![Package dependency count](https://badgen.net/bundlephobia/dependency-count/react@scoby/analytics-ts)](https://bundlephobia.com/package/@scoby/analytics-ts)

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install @scoby/analytics-ts --save

# For Yarn, use the command below.
yarn add @scoby/analytics-ts
```

## Prerequisites
You need two values to instantiate your scoby analytics client: your API key and a salt.
The salt is used to anonymize your traffic before it is sent to our servers.
You can generate a cryptographically secure using the following command:

````shell
openssl rand -base64 32
````

Please find your API key in your [workspace's settings](https://app.scoby.io) - don't have a workspace yet? Create one for free [here](https://app.scoby.io)


## Usage
Instantiate your scoby analytics client using your API key and salt.
```typescript
import { Client } from '@scoby/analytics-ts';
const client = new Client('INSERT_YOUR_API_KEY_HERE', 'INSERT_YOUR_SALT_HERE');
```

The client supports asynchronous logging of page views via its `logPageView` method
```typescript

await client.logPageView({
  ipAddress: [IP_ADDRESS],
  requestedUrl: [REQUESTED_URL],
  referringUrl: [REFERRING_URL],
  userAgent: [USER_AGENT]
});
```

### Visitor Segments
Visitor segmentation is a way to group website visitors based on their common characteristics or behaviors. By analyzing the browsing behavior of your different visitor segments, you can identify patterns or trends that can inform your website design or marketing strategy.

To use visitor segments, you need to define the characteristics or behaviors that you want to segment your audience by, such as age, gender, location, interests, or purchase history. Once you have defined your segments, you can assign them to your website visitors based on the data you collect from their interactions with your website. It's important to note that segments should always be used in plural, as this makes the most sense in the Scoby Analytics dashboard, where you can view and analyze your visitor segments data. Additionally, it's important to keep in mind that all future interactions of a visitor are associated with the segment they belong to at the time of the interaction. This means that if a visitor's segment changes over time, their new interactions will be associated with the new segment, rather than the previous one.

To log visitor segments using the Scoby Analytics library in your TypeScript code, you can use the visitorSegments parameter when calling the logPageView method. Here's an example:

```typescript
import { Client } from '@scoby/analytics-ts';
const client = new Client('INSERT_YOUR_API_KEY_HERE', 'INSERT_YOUR_SALT_HERE');

await client.logPageView({
  ...
  visitorSegments: ['Subscribers', 'Women', 'Young Adults']
});
```

In this example, we are logging a page view event and assigning the visitor segments Subscribers, Women, and Young Adults to the visitor who triggered the event. You can replace these segments with your own segment names based on your segmentation strategy.

It's worth noting that Scoby Analytics is designed to be privacy-preserving, and applies a k-Anonymity of 25 to visitor segments. This means that each segment must have at least 25 unique visitors before it is included in the analytics report, in order to protect the anonymity of individual visitors.

### Visitor ID
To help you count your visitors as accurately as possible, you can provide a custom identifier, such as an account id, etc. This value is hashed before being sent to our servers to ensure that no personally identifiable information reaches our servers. However, to be on the safe side, you should talk to your data protection officer before using this feature.

```typescript
import { Client } from '@scoby/analytics-ts';
const client = new Client('INSERT_YOUR_API_KEY_HERE', 'INSERT_YOUR_SALT_HERE');

await client.logPageView({
  ipAddress: [IP_ADDRESS],
  requestedUrl: [REQUESTED_URL],
  userAgent: [USER_AGENT],
  referringUrl: [REFERRING_URL],
  visitorId: [YOUR_VISITOR_ID]
});
```

### IP Blacklisting
By default, scoby will not exclude any traffic from your measurements, but we understand that sometimes it is necessary
to filter out traffic originating from a range of IP addresses. To do this, we added the `blacklistIpRange` method,
which supports wildcard patterns as well as CIDR subnet notation for your convenience.
You can add as many IPs, patterns and ranges as you like.
```typescript
client.blacklistIpRange('12.34.*.*')
client.blacklistIpRange('87.65.43.21/16')
client.blacklistIpRange('1.2.3.4')
client.blacklistIpRange('::1');
```

Complete example:

```typescript
import { Client } from '@scoby/analytics-ts';
const client = new Client('INSERT_YOUR_API_KEY_HERE', 'INSERT_YOUR_SALT_HERE');

client.blacklistIpRange('12.34.*.*');

await client.logPageView({
  ipAddress: '12.34.56.78', // range '12.34.*.*' includes '12.34.56.78'
  ...
}); // returns: false
```

## Testing
```
npm test
```

## Support
Something's hard? We're here to help at [hello@scoby.io](mailto:hello@scoby.io)

