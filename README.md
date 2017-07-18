# WebHare news folder

## Install

Load the package in your site profile:

```
<loadpackage module="webwerf-wh-news" scopenamespace="http://www.mydomain.com/webwerf-wh-news/" />
```

Replace `www.mydomain.com` with your site's primary namespace.

Import in JavaScript (.es file):

```
import * as dompack from 'dompack';
import { setupNewsPage } from 'webwerf-wh-news';

dompack.onDomReady(() => {
  setupNewsPage();
});
```

Optionally add default CSS:

```
@import '~webwerf-wh-news/src/news';

@at-root {
  @include pagenav;
  @include index;
  @include details;
}

You can overwrite the CSS to set your own styling.
```

After reloading site profiles you can add a folder of type `http://www.mydomain.com/webwerf-wh-news/`. This folder automatically creates an index file (you should protect it) and lets you add news items to it.
