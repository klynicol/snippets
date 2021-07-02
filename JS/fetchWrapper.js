 objectToFormData(obj, form, namespace) {
    var fd = form || new FormData();
    var formKey;

    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (namespace) {
          formKey = namespace + "[" + property + "]";
        } else {
          formKey = property;
        }
        // if the property is an object, but not a File,
        // use recursivity.
        if (
          typeof obj[property] === "object" &&
          !(obj[property] instanceof File)
        ) {
          this.objectToFormData(obj[property], fd, property);
        } else {
          // if it's a string or a File object
          fd.append(formKey, obj[property]);
        }
      }
    }
    return fd;
  }

  async sendGet(url, alert = false) {
    const response = await fetch(url, {
      method: "GET",
    })
      .then((response) => {
        this.lastRespone = response;
        const contentType = response.headers.get("content-type");
        let data;

        //Attempt to parse the data
        if (contentType.includes("application/json")) {
          data = response.json();
        } else if (contentType.includes("text/html")) {
          data = response.text();
        } else {
          data = response.blob();
        }

        if (!response.ok) {
          // get error message from body or default to response status
          const error = data.message || data || response.status;
          return Promise.reject(error);
        }
        return data;
      })
      .catch((err) => {
        console.log(err);
        if (alert) alert(err);
      });
    return response;
  }

  /**
   * Wrapper for fetch that will detect data type and attempt to parse.
   * Errors are logged and alerted by default.
   *
   * @param {*} input JSON parsable info
   * @param {*} url
   */
  async sendPost(input, url, alert = true) {
    const result = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      body: this.objectToFormData(input),
    })
      .then((response) => {
        this.lastRespone = response;
        const contentType = response.headers.get("content-type");
        let data;

        //Attempt to parse the data
        if (contentType.includes("application/json")) {
          data = response.json();
        } else if (contentType.includes("text/html")) {
          data = response.text();
        } else {
          data = response.blob();
        }

        if (!response.ok) {
          // get error message from body or default to response status
          const error = data.message || data || response.status;
          return Promise.reject(error);
        }
        return data;
      })
      .catch((err) => {
        console.log(err);
        if (alert) alert(err);
      });
    return result;
  }
