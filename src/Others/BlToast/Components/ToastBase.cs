using BlToast.Services;
using Microsoft.AspNetCore.Components;
using System;

namespace BlToast.Components
{
    public class ToastBase : ComponentBase, IDisposable
    {
        [Inject] public ToastService ToastService { get; set; }

        public string Heading { get; private set; }
        public string BackgroundCssClass { get; private set; }
        public string IconCssClass { get; private set; }
        public string VisibleCssClass { get; private set; }

        public string Message { get; set; }

        //Flag to suppress the showing of the component markup until the 
        //ToastService.Show event is raised.
        public bool ShouldShow = false;

        protected override void OnInitialized()
        {
            ToastService.Show += OnShow;
        }

        //Must contain the call the to base.InvokeAsync() method for the MVC call
        //To cross from the component thread to the MVC thread and call out to the 
        //other registered components.
        protected virtual void OnShow(Object sender, ShowEventArgs e)
        {
            BuildToastSettings(e.ToastLevel, e.Message);
            
            //Need to call this way when using service.AddSingleton for global app state
            //-- see comments above.
            base.InvokeAsync(StateHasChanged);

            //Can uncomment and use if the ToastService is using AddScoped for a 
            //Client scoped object.
            //StateHasChanged();
        }

        public void Dispose()
        {
            ToastService.Show -= OnShow;
        }

        private void BuildToastSettings(ToastLevel level, string message)
        {
            switch (level)
            {
                case ToastLevel.Info:
                    BackgroundCssClass = "bg-info";
                    IconCssClass = "info";
                    Heading = "Info";
                    break;
                case ToastLevel.Success:
                    BackgroundCssClass = "bg-success";
                    IconCssClass = "check";
                    Heading = "Success";
                    break;
                case ToastLevel.Warning:
                    BackgroundCssClass = "bg-warning";
                    IconCssClass = "exclamation";
                    Heading = "Warning";
                    break;
                case ToastLevel.Error:
                    BackgroundCssClass = "bg-danger";
                    IconCssClass = "times";
                    Heading = "Error";
                    break;
            }

            //Toggles between two identical css classes and animations, causing the browser to rerun the 
            //animation.
            VisibleCssClass = VisibleCssClass == null || VisibleCssClass == "toast-visible1"
                ? "toast-visible" : "toast-visible1";

            Message = message;
            ShouldShow = true;
        }
    }
}
