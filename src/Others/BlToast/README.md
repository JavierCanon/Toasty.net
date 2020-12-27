# Blazor Toast
This application implements a Toast notification across all connected clients using Blazor on .Net Core 3.1 server side.

This is a Visual Studio 2019 solution in c# from the base Server Side Blazor template.

Reading from various blog posts I came up with this solution.  Thank you to *Chris Saintly* for his very helpful blogposts at <br/>
 [3 Ways to Communicate between Components in Blazor](https://chrissainty.com/3-ways-to-communicate-between-components-in-blazor/)<br/>
 [Blazor Toast Notifications using only c#, HTML and css](https://chrissainty.com/blazor-toast-notifications-using-only-csharp-html-css/)
### Problems this project solves

* Sending a notification from the server to all connected clients __without using javascript__.
* Allowing the change for the service scope dependency injection to make it scope to client also.
* Code for handling the css gotcha issues with setting an animation and having it not play when a new notification is posted.
* Code for handling the invoke of async events between the blazor component and the MVC application.

### Scenarios
The common objects for the scenarios are:
* __Toast Service__ - Used as the Event Broker for all the Toast components.
* __Toast Component__ - Shows the toast notification when the ToastService raises _Show_ event. 
* __Css Classes__ - Borrowed from Chris Saintly with additions to fix the css animation issue.
    * _(When you set a class to run a css animation, remove the class and add it back, the animation will still
    not play.  You get it to play by toggling between two identical classes, tricking the browser)_

#### Send a Toast Notification from the server to all connected clients
For this demo there are several buttons for various notification types set on the home page.  When clicked, they will show their
type of notification in a toast like popup on the page.  For the demo, this will also show on the *Count* page, 
but not the *Fetch Data* page.  I wanted to distinguish showing on various portions of an application.

To accomplish this, the following code items must be set:
- __`services.AddSingleton<ToastService>()` in the Startup.cs file.__  This is for a shared Application State object.
- __ToastBase.cs must contain the `base.InvokeAsync(StateHasChanged)` call in the OnShow() event handler.__
  - You will get a javascript error regarding invoke on the thread.  My understanding is this will fix the issue by allowing the Blazor component thread to hand off the event asynchrounously to the MVC event thread for dispatch.

#### Send a Toast Notification from the Client or server to one connected client
This means that each client, when clicking the notification buttons, will only post notifications to their client.  This also means that when the Show event from the ToastService is raised server side, it will also show for that one client.

To accomplish this, the following code items must be set:
- __`services.AddScoped<ToastService>()` in the Startup.cs file.__  This is for a client scoped Application State object.
- __ToastBase.cs can call `StateHasChanged()` directly or contain the `base.InvokeAsync(StateHasChanged)` call in the OnShow() event handler.__
 
I hope this helps someone understand this a little better.  Thank you Chris Saintly for the information to get started.
