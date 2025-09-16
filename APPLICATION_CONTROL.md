# Application Form Control

## Quick Start

To **open** or **close** the club application form, simply edit this file:

```
src/config/application.ts
```

## How to Open/Close Applications

1. Open the file `src/config/application.ts`
2. Find the line: `APPLICATION_OPEN: false,`
3. Change it to:
   - `APPLICATION_OPEN: true,` to **OPEN** applications
   - `APPLICATION_OPEN: false,` to **CLOSE** applications
4. Save the file

That's it! The change will take effect immediately.

## Customizing Messages

You can also customize the messages shown to users:

### When Applications are Closed
Edit the `CLOSED_MESSAGE` section to change:
- Title shown to users
- Description explaining why applications are closed
- Message about when they'll reopen

### When Applications are Open
Edit the `OPEN_MESSAGE` section to change:
- Title of the application section
- Description encouraging users to apply

## Current Status

The application form is currently: **CLOSED** ❌

To open it, change `APPLICATION_OPEN: false` to `APPLICATION_OPEN: true` in `src/config/application.ts`