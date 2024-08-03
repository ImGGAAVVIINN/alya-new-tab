Roshidere New Tab Page
=======================

New tab page with themed with _Alya Sometimes Hides Her Feelings in Russian_

![demoMain](https://github.com/user-attachments/assets/e988fa4e-0183-4012-bc40-41bc783902f0)

### Features

- Quick access dropdown to add your most used sites, which allow you to rename and reorder them
- Apps Dropdown to access Google services and popular websites
- Built in to-do lists and Post-it notes
- Weather widget updating automatically based on your location
- Good-looking effects like countdown clock and snow/rain/leaves animation
- Highly customizable settings to enable/disable each elements individually and auto-hide delay
- Different search engines like Google, YouTube, Yahoo, Brave and more
- 2 different search box styles to chose from


<details>
  <summary><h3>manual installation guide for chromium based browsers (Chrome, Brave, Opera, Vivaldi)</h3></summary>
  
  1. Download the [Latest version](https://github.com/ImGGAAVVIINN/alya-new-tab/releases/latest/download/alya-new-tab_chromium.crx) from the release section               
     _If directly download .crx file is not working, download the [zipped version](https://github.com/ImGGAAVVIINN/alya-new-tab/releases/latest/download/alya-new-tab_chromium.crx.zip)_   
  2. If browser ask for confirmation to download, press 'keep'  
     ![Screenshot_20240803_190129](https://github.com/user-attachments/assets/a6301372-144a-4eab-bf16-042f56679dae)
  3. go to chrome://extensions and enable 'Developer mode'   
     ![image](https://github.com/user-attachments/assets/9229b8b2-b8f6-4f10-be00-32f3927d4d32)    
  4. Drag the .crx file into the extensions page

</details>

<details>
  <summary><h3>manual installation guide for Firefox based browsers (Firefox, LibreWolf, Waterfox, Floorp)</h3></summary>  
  
  ### Based on Firefox ESR, Unstable, and Development
  1. Download the [Latest version](https://github.com/ImGGAAVVIINN/alya-new-tab/releases/latest/download/alya_start_page_firefox.xpi) from the release section       
  2. Go to about:config, type in xpinstall.signatures.required in the search box, and click on the toggle button to set it to false     
     ![image](https://github.com/user-attachments/assets/36f63cbf-3971-4455-a96e-ff063fa51b4a)
  3. Click on the gear button --> 'install Add-on From File' and choose the .xpi file you downloaded         
     ![image](https://github.com/user-attachments/assets/c8b43ff0-0d41-416f-af66-aab1556b2a0e)


  ### Firefox Stable
  1. **To sideload an unsigned extension on Firefox Stable, you first need to "Jail-break" it** ¯\\_(ツ)_/¯   
  - If you are on Linux, follow [This guide](https://gist.github.com/TheBrokenRail/c43bf0f07f4860adac2631a1bd9e4136)       
  - If you are on Windows run the .bat file in [This repo](https://github.com/ImGGAAVVIINN/Jailbreak-Firefox-Windows), or apply the changes your self by looking at the bat file if you know what you are doing   
  2. Download the [Latest version](https://github.com/ImGGAAVVIINN/alya-new-tab/releases/latest/download/alya_start_page_firefox.xpi) from the release section  
  3. Click on the gear button --> 'install Add-on From File' and choose the .xpi file you downloaded         
     ![image](https://github.com/user-attachments/assets/c8b43ff0-0d41-416f-af66-aab1556b2a0e)  

</details>

Screenshots
-----------
<img src="https://github.com/user-attachments/assets/823f9f85-9d51-4838-bc03-cbc0f08f6e62" width="750">    
  
^ Big search bar       

      
<img src="https://github.com/user-attachments/assets/e38832b5-9171-417f-a8bd-c33d814d23e0" width="750"><img src="https://github.com/user-attachments/assets/e38832b5-9171-417f-a8bd-c33d814d23e0" width="750">    
  
^ Most Visited and Apps dropdown      

![demo1](https://github.com/user-attachments/assets/d02e1bff-a3cc-4e24-be03-24086427ebaa)

  
^ Demo of how The Quick Access dropdown work     

      
<img src="https://github.com/user-attachments/assets/c774918c-95ab-4be2-8004-ebd05b6ff8e8" width="750">       
  
^ Animation effects, the one this screenshot is using is leaves      
      
![demo2](https://github.com/user-attachments/assets/bd1412c5-deb5-4048-8efb-8340506032f3)

^ Demo of custom auto-hide delay   
   

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
5. The extension should be loaded now and the 'New Tab' page should be Alya New Tab. 🎉

> The code makes use of `localStorage()` to save the raw text, revision history, last edited time and date, settings and last cursor position.

### Testing in Firefox

In Firefox, the extension can be installed temporarily until you restart the browser. To do so:

1. Enter `about:debugging` in the URL bar
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


