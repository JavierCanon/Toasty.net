using System;

namespace BlToast.Services
{
    public class ToastService
    {
        public event EventHandler<ShowEventArgs> Show;

        public void ShowToast(string message, ToastLevel level)
        {
            Show?.Invoke(this, new ShowEventArgs(level, message));
        }
    }

    public struct ShowEventArgs
    {
        public string Message { get; set; }
        public ToastLevel ToastLevel { get; set; }

        public ShowEventArgs(ToastLevel toastLevel, string message )
        {
            Message = message;
            ToastLevel = toastLevel;
        }
    }
}
