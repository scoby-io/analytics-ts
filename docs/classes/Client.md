[@scoby/analytics-ts](../README.md) / Client

# Class: Client

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Properties

- [apiHost](Client.md#apihost)
- [ipBlacklistPatterns](Client.md#ipblacklistpatterns)
- [whitelistedUrlParameters](Client.md#whitelistedurlparameters)
- [workspaceId](Client.md#workspaceid)

### Methods

- [addWhitelistedUrlParameter](Client.md#addwhitelistedurlparameter)
- [blacklistIpRange](Client.md#blacklistiprange)
- [getReferringUrl](Client.md#getreferringurl)
- [getRequestedUrl](Client.md#getrequestedurl)
- [getVisitorId](Client.md#getvisitorid)
- [getWorkspaceId](Client.md#getworkspaceid)
- [hash](Client.md#hash)
- [isBlockedIp](Client.md#isblockedip)
- [logPageView](Client.md#logpageview)

## Constructors

### constructor

• **new Client**(`apiKey`, `salt`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKey` | `string` |
| `salt` | `string` |

## Properties

### apiHost

• `Private` `Readonly` **apiHost**: `string`

#### Defined in

index.ts:17

___

### ipBlacklistPatterns

• `Private` **ipBlacklistPatterns**: `string`[] = `[]`

#### Defined in

index.ts:18

___

### whitelistedUrlParameters

• `Private` **whitelistedUrlParameters**: `string`[]

#### Defined in

index.ts:19

___

### workspaceId

• `Private` `Readonly` **workspaceId**: `string`

#### Defined in

index.ts:16

## Methods

### addWhitelistedUrlParameter

▸ **addWhitelistedUrlParameter**(`param`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `param` | `string` |

#### Returns

`void`

___

### blacklistIpRange

▸ **blacklistIpRange**(`pattern`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` |

#### Returns

`void`

___

### getReferringUrl

▸ `Private` **getReferringUrl**(`referringUrl`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `referringUrl` | `string` |

#### Returns

`string`

___

### getRequestedUrl

▸ `Private` **getRequestedUrl**(`requestedUrl`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `requestedUrl` | `string` |

#### Returns

`string`

___

### getVisitorId

▸ `Private` **getVisitorId**(`pageView`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageView` | [`PageView`](../interfaces/PageView.md) |

#### Returns

`string`

___

### getWorkspaceId

▸ `Private` **getWorkspaceId**(): `string`

#### Returns

`string`

___

### hash

▸ `Private` **hash**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

___

### isBlockedIp

▸ `Private` **isBlockedIp**(`ipAddress`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ipAddress` | `string` |

#### Returns

`boolean`

___

### logPageView

▸ **logPageView**(`pageView`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageView` | [`PageView`](../interfaces/PageView.md) |

#### Returns

`Promise`<`boolean`\>
