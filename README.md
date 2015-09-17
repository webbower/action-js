# ActionJS

Simplify your UI actions

ActionJS is a super lightweight utility library to simplify wiring up the press-type handlers (click and eventually tap [touch]) in your app. Most of the interactions a user has with your software are pressing UI buttons, which means wiring up a boatload of click/touch handlers. ActionJS wires up one smart global handler and only requires one `data-*` attribute to wire up your whole suite of press-based user interactions. Additionally, the global handler will be optimized for the input format (mouse/keyboard or touch) to save you time and code figuring out how to wire both types up.

How does this magical library accomplish this, you ask? I'm glad you asked. It's really quite simple.

First, define your handler and give it a name:

```js
ActionJS.register('print', function(ev) {
  window.print();
})
```

Now you have a `print` action that you can use anywhere. So how do you attach it to your UI?

```html
<button type="button" data-action="print">Print</button>
```

That's it. No clutter on the `class` attribute. No classes with prefixed with `js-*`. No mess of additional `data-*` attributes for fairly straightfoward actions. It's very obvious that the button performs the `print` action. The handler executes with the usual expectations: `this` points to the triggering DOM element and the event object is passed in to the handler.

What if you need custom data for the handler to work correctly? That's where custom `data-*` attributes and other HTML attributes come in handy. Let's say you want to use this pattern for the usual CRUD actions on a data table.

```js
// This isn't necessarily how I'd implement this behavior, but it's illustrative enough for doc purposes
ActionJS.register('user.delete', function(ev) {
  var userId = this.getAttribute('data-user-id');

  User.delete(userId);
})

ActionJS.register('user.edit', function(ev) {
  var userId = this.getAttribute('data-user-id');

  User.edit(userId);
})
```

**Note:** The namespacing of the action names is totally arbitrary. ActionJS doesn't inherently support any fancy namespacing.

```html
<table>
  <thead>
    <tr>
      <th>User name</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bob Smith</td>
      <td>
        <button type="button" data-action="user.edit" data-user-id="10">Edit</button>
        <button type="button" data-action="user.delete" data-user-id="10">Delete</button>
      </td>
    </tr>
    <!-- ... -->
  </tbody>
</table>
```

ActionJS is not meant for all press-type handlers. It ONLY works for click and tap (touch press) handlers. You wouldn't use it for a custom form submission handler (that would use the `submit` event). It's mainly meant for isolated action handlers: actions where any necessary custom data or per-instance configuration can be drawn from the triggering element. You probably shouldn't traverse the DOM for any of it because these actions are meant to be usable anywhere in your application and shouldn't rely on DOM structure.

## API

### `ActionJS.register(name, handler)`

* `name` (string) - The name of the handler. Handlers are unique and cannot be overwritten once defined. This is what set the `data-action` value to.
* `handler` (function) - The handler function. This function receives one argument (the event object [in this case, a jQuery event object]) and you can call `preventDefault()` and `stopPropagation()` on it as normal. `this` is bound to the element that has the `data-action` attribute on it.

Additionally, `register` supports a second signature for bulk registering: `ActionJS.register(handlers)` where `handlers` is a POJO [link needed] where each key is a `name` and each value is a `handler` as above.

### `ActionJS.dump()`

A helper function to see all the handlers that are registered. Currently outputs the entire collection via `console.dir`

## Suggested Conventions

### Handler Names

Since handler names are just strings, coming up with a naming system is probably a good idea.

* Related functionality (such as CRUD actions for various data types) should use a namespacing convention (e.g. `user.delete`, `user.edit`, etc)
* (Faux) namespacing should be separated with dots
* Multi-word names should be separated with something like hyphens or underscores.

## TODOs

* Remove jQuery dependency (plain object, function, each, event binding)
* Provide hooks for custom event binding lib
* Add touch handler support
* Add configuration support?
* Add noConflict support?
* Add AMD support
