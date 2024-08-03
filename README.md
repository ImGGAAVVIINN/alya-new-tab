Roshidere New Tab Page

New tab page with themed with _Alya Sometimes Hides Her Feelings in Russian_

![demoMain](https://github.com/user-attachments/assets/e988fa4e-0183-4012-bc40-41bc783902f0)

### Features

- Quick access dropdown to add your most used sites, which allow you to rename and reorder them
- Apps Dropdown to access Google services and popular websites
- Built in to-do lists and Post-it notes
- Automatically Weather forecast based on your location
- Good looking effects like countdown clock and snow/rain/leaves animation
- Highly customizable settings to enable/disable each elements individually and auto-hide delay
- Different search engines like Google, YouTube, Yahoo, Brave and more
- 2 different search box styles to chose from


<details>
  <summary><h3>manual installation guide for chromium based browsers (Chrome, Brave, Opera, Vivaldi)</h3></summary>
  
  1. Download the [Latest version](https://github.com/ImGGAAVVIINN/alya-new-tab/releases/latest/download/alya-new-tab_chromium.crx) from the release section   
  2. If browser ask for confirmation to download, press 'keep'


  ### Some Javascript
  ```js
  function logSomething(something) {
    console.log('Something', something);
  }
  ```
</details>

<details>
  <summary><h3>manual installation guide for Firefox based browsers (Firefox, LibreWolf, Waterfox, Floorp)</h3></summary>  
  
  ### Based on Firefox ESR, Unstable, and Development
  1. Foo
  2. Bar
     * Baz
     * Qux

  ### Firefox Stable

</details>

Screenshots
-----------
![](media/shot.2.png)
![](media/shot.3.png)
![](media/shot.4.png)
![](media/shot.5.png)

## Explanation of permissions:

- **Storage**: Used to store your settings in the browser's storage area.
- **Replace the page you see when opening a new tab**: Used to replace the New Tab page with this extension.
- **This extension can read and change your data on sites**: The sites listed with this permission are used to retrieve data for this extension to function.
- **https://fonts.googleapis.com/***: The fonts available in the extension are from Google Fonts; this URL is where the fonts are loaded from.
- **Read the icons of the websites you visit**: Used to display the favicons (logos) of the website you add to your Most Visited dropdown.
- **Read a list of your most frequently visited websites**: Used to display the "most visited" dropdown menu, when enabled.

## Development

1. Clone this repo:

```sh
$ git clone https://github.com/plibither8/markdown-new-tab
```
**OR**  
green '<> Code' button --> 'Download ZIP' & Unzip the archive you just downloaded  
  
2. Open Chrome and go to `chrome://extensions`
3. Enable 'Developer Mode' by checking the tick box (on the top of the page).
4. Click the 'Load Unpacked Extension' button and select the folder of the cloned repository.
5. The extension should be loaded now and the 'New Tab' page should be Markdown New Tab. 🎉

> The code makes use of `localStorage()` to save the raw text, revision history, last edited time and date, settings and last cursor position.

### Testing in Firefox

In Firefox, the extension can be installed temporarily until you restart the browser. To do so:

1. enter `about:debugging` in the URL bar
2. click "Load Temporary Add-on"
3. open the extension's directory in your local repo and select [`manifest.json`](manifest.json)

More info [here](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

## No affiliation with Roshidere, their authors, or publishers!

_I am not affiliated with Roshidere, SunSunSun or Doga Kobo.  
I am just a hobby developer who is a fan of the series_


## Legal

Alya New Tab is released under the [MIT license](http://bit.ly/mit-license). 

* jQuery: Code is MIT Licensed. Details are available [here](https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt)


Changelog
---------

### Version 1.0 - Aug 2, 2024

- Initial release
