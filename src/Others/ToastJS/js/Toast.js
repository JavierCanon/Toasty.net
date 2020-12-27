
/**
 * @author Jacky Wong
 * 
 * Creates an element area for toasts to be inserted and then creates and manages individual stackable toasts.
 *
 * options with the following properties
 * @param {string} message primary message to be displayed in the body of the toast.
 *  Note: can contain HTML.
 * @param {string} subject text that shows as the subject of the Toast. Has a default.
 *  Note: can contain HTML such as font awesome elements.
 * @param {string} indicator small text that appears next to the subject. e.g. 1 min ago
 *  Note: can contain HTML.
 * @param {string} id html id tag for uniquely identifying a Toast. it's used so that it doesn't
 *  create duplicate toast and, instead, show that toast. if id is not given, it creates one by using
 *  the subject, and if that's not given, it creates a unique id.
 */
class Toast {
  constructor(options) {
    if (!options.message) {
      throw new Error('You need to pass a message for the toast to display.');
    }

    let defaultSubject = "Toast Notification";

    this.message = options.message;
    this.subject = options.subject || defaultSubject;
    this.indicator = options.indicator || "";
    this.id = options.id;

    let toastDiv = document.getElementById('toast-container');
    if (toastDiv == null) {
      toastDiv = createElementFromHTML(`
      <div aria-live="polite" aria-atomic="true" class="position-fixed">
        <div>

        </div>
      </div>`);
      toastDiv.id = "toast-container";
      document.body.insertBefore(toastDiv, document.body.childNodes[0]);
    }

    // if id isn't given and subject is default, make subject the id by removing all html and making it snake casing
    // otherwise, create own id with counts
    if (this.id == null) {
      if (this.subject == defaultSubject) {
        this.id = "toast-" + $(".toast").length;
      } else {
        // strip out any html tags and then replace spaces with dashes
        this.id = this.subject.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s/g, '-');
      }
    }

    let toastBlock = document.getElementById(this.id);
    // search if the toast with the same subject already exists. if it doesn't, create it and append it to DOM
    if (toastBlock == null) {
      toastBlock = createElementFromHTML(`
        <div class="toast" id="${this.id}" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">
          <div class="toast-header">
            <strong class="mr-auto">${this.subject}</strong>
            <small>${this.indicator}</small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="toast-body">
            ${this.message}
          </div>
        </div>`);
      toastDiv.firstElementChild.appendChild(toastBlock);
    }

    $(toastBlock).toast('show');

    return $(toastBlock);
  }
}

/**
 * Creates and returns an element from a string
 *
 * @param {string} htmlString
 */
function createElementFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}