# AuraToast
Aura Toast is a custom-element and service built specifically for Aurelia that leverages the powerful features it offers to offer a powerful notification plugin.

# Getting Started
I currently don't have any plans to create an NPM package for AuraToast, for now I simply providing the source files. Using Aura Toast in your project should be as simple as dropping the source files into your custom elements directory.

### Example Setup
1. Download source files
2. Navigate to `<project source directory>/resources/elements` and create a new folder `aura-toast`
3. Paste source files into the new `aura-toast` folder
4. Include the custom elements in your Framework Configuration
```TypeScript
import {FrameworkConfiguration, PLATFORM} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([PLATFORM.moduleName('./elements/aura-toast/aura-toast')]);
    config.globalResources([PLATFORM.moduleName('./elements/aura-toast/components/aura-toast-body')]);
    config.globalResources([PLATFORM.moduleName('./elements/aura-toast/components/aura-toast-title')]);
    config.globalResources([PLATFORM.moduleName('./elements/aura-toast/components/aura-toast-content')]);
}
```
# Using Aura Toast
### Basic Usage
At the most basic level, the only thing you have to do to use Aura Toast is to include the `<auratoast></auratoast>` custom element in your root or app page. This will ensure that you always have a toast element available across all pages.

#### Example
`app.html`
```Html
<template>
    <router-view></router-view>
    <auratoast></auratoast>
</template>
```

Now that you have included the `auratoast` element, creating toast messages is as easy as injecting the `AuraToastService` and calling any of the provided methods for creating a toast. For a full list of functions provided by the service see the API overview below.

#### Example
`home.ts`
```TypeScript
@autoinject()
export class Home {
    constructor(private toastService: AuraToastService) {
    }
    
    showSuccess() {
      let title = 'Success!';
      let message = 'This is a successful toast message';
      this.toastService.success(new AuraToastRequest(message, title));
    }
}
```

All done! Now when you call the showSuccess method your toasts will display in the top right corner by default. 

### Basic Configuration
The toast messages have a number of configurable options that can be set by calling the `configure` method on the toast service. For a full list of configurable options see the API overview below.

#### Example
`app.ts`
```TypeScript
@autoinject()
export class App {
    constructor(private toastService: AuraToastService) {
    }
    
    setupToastService() {
      let settings = <AuraToastSettings>{
        position: AuraToastPositions.topleft
      };
      this.toastService.configure(settings);
    }
}
```

### Advanced Usage
Aura Toast is quite powerful and offers alot of customisation potential and this is where it becomes apparant as to why I have chosen to use custom elements for a toast plugin.

Aura Toast can be used in multiple places across many pages or even on the same page. The `auratoast` custom element offers a single bindable option "key". This bindable option allows you to specify a unique key that will be associated with this instance of Aura Toast.

#### Example
```Html
<auratoast key.bind="'hometoastoutput'"></auratoast>
```

When you specify a key for an Aura Toast element a few things happen. The first is that you gain the ability to specifically target this element when you call any of the toast services methods.

#### Example
`home.ts`
```TypeScript
@autoinject()
export class Home {
    constructor(private toastService: AuraToastService) {
    }
    
    showSuccess() {
      let title = 'Success!';
      let message = 'This is a successful toast message';
      this.toastService.success(new AuraToastRequest(message, title, 'hometoastoutput'));
    }
}
```

The other critcal change is that Aura Toast stops treating this toast element as a fixed element and instead starts treating it as a block element. Therefore any Aura Toast elements specified with a key binding gain the following attributes:

1. They will display as a block element
2. They will utilise all available width of the parent element

This allows you to specify an Aura Toast element within the page and send messages directly to it, toasts sent this way will not appear in any other Aura Toast element apart from the one you specified based on the key provided in the request.

This gives you a significant degree of control over how you want your toast messages to be displayed. However Aura Toast provided one more powerful feature: Replaceable Parts (thanks to Aurelia).

### Advanced Configuration
The `auratoast` custom element contains a replaceable part, which allows you to specify your own body contents for each toast message. This is where the other custom-elements become useful. There are three additional custom elements provided: `atoast-body` `atoast-title` and `atoast-content`. These are used to allow you to specify your own markup whilst still ensuring the toast elements can retrieve the data they required.

The first custom element `atoast-body` provides a wrapper for the other two and is required for them to work. It also has two mandatory bindable values which must be specified exactly this way: 
`<atoast-body title.bind="toast.title" content.bind="toast.content">...</atoast-body>

The bindings must be specified this way because the replaceable part is slotted into a repeatable element which exposes the variable `toast`. The title and content custom elements listen to their parent body element to get their respective values.

#### Example
`home.html`
```Html
<template>
  <auratoast key.bind="'hometoastoutput'">
      <template replace-part="body">
          <atoast-body title.bind="toast.title" content.bind="toast.content">
              <div class="row">
                  <div class="col-sm-1">
                      <i class="fas fa-home fa-2x"></i>
                  </div>
                  <div class="col-sm-11">
                      <atoast-title></atoast-title>
                      <atoast-content></atoast-content>
                  </div>
              </div>
          </atoast-body>
      </template>
  </auratoast>
</template>
```

The first thing to note about the example above is the `<template replace-part="body">` tag inside the `auratoast` element. This is a feature of Aurelia, essentially the `auratoast` custom element exposes a replaceable part called body and here we are saying that we want to replace that body part with the contents of the `<template>` element.

The next thing is the required `<atoast-body>` wrapper with the required bindings, note that even though this element is not inside any repeatable element we still specify the bindables as `title.bind="toast.title" content.bind="toast.content"` because this replaceable part will be slotted into a repeatable element.

The `<atoast-title>` and `<atoast-content>` tags are very basic wrapper for the content. The `<atoast-title>` will create result in the following: `<label if.bind="title">${title}</label>` and as such will only display if the title is specified. The `<atoast-content>` will always display and simply resolves to `${content}`.

Using the replaceable part you can specify any markup or additional content within the toast message that you want, including links and buttons.

# API Overview
### Classes
`AuraToastRequest`
Should be used via the constructor method.

```TypeScript
new AuraToastRequest(content: string, title?: string, key?: string);

content!: string;
title!: string | null;
key!: string | null;
```

`AuraToastSettings`
```TypeScript
export class AuraToastSettings {
    duration!: number;
    extendedDuration!: number;
    position!: AuraToastPositions;
    maxWidth!: string;
}
```

### Enums
`AuraToastPositions`
Should be used as such: `AuraToastPositions.top`

```TypeScript
export enum AuraToastPositions {
    top = 1,
    topleft = 2,
    topright = 3,
    bottom = 4,
    bottomleft = 5,
    bottomright = 6
}
```

### Service Methods
`AuraToastService`
The service exposes a number of methods, some of which are used by the custom elements and should not be used. The following methods are the methods that should be used manually:

```TypeScript
public success(request: AuraToastRequest): void {
    this.postMessage(AuraToastTypes.success, request);
}

public info(request: AuraToastRequest): void {
    this.postMessage(AuraToastTypes.info, request);
}

public warning(request: AuraToastRequest): void {
    this.postMessage(AuraToastTypes.warning, request);
}

public error(request: AuraToastRequest): void {
    this.postMessage(AuraToastTypes.error, request);
}

public configure(settings: AuraToastSettings) {
    this.settings = settings;
}
```

By default the AuraToastService uses the following settings:
```TypeScript
public settings = <AuraToastSettings>{
      duration: 3000, // Display for 3 seconds
      extendedDuration: 1000, // Display for an additional 1 second after mouse over exit 
      position: AuraToastPositions.topright, // Display in top right
      maxWidth: '400px' // Limit toast size to 400px
  };
```

# Credits
Inspiration taken from CodeSeven's toastr: [https://github.com/CodeSeven/toastr](https://github.com/CodeSeven/toastr)

# Copyright
Copyright © 2018

# License
Aura Toast is licensed under the [MIT license](https://opensource.org/licenses/MIT) 
