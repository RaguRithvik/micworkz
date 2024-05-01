import { constants, newConstants } from './constants';
import React, { useState, useEffect, useRef ,useCallback} from 'react';
import axios from 'axios';
import { useStore } from './Store';
import { useRouter } from 'next/router';

function useFocusNext() {
  const controls = useRef([]);

  const handler = (event) => {
    if (event.keyCode === 13) {
      // Required if the controls can be reordered
      controls.current = controls.current
        .filter((control) => document.body.contains(control))
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1 : 1
        );

      const index = controls.current.indexOf(event.target);
      const next = controls.current[index + 1];
      next && next.focus();

      // IE 9, 10
      event.preventDefault();
    }
  };

  return useCallback((element) => {
    if (element && !controls.current.includes(element)) {
      controls.current.push(element);
      element.addEventListener('keydown', handler);
    }
  }, []);
};

const getDateddMMMyyyy = (date) => {
  if (date) {
    let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
    let year = date.getFullYear();
    return `${(day + '').length == 1 ? '0' + day : day} ${monthName} ${year}`;
  } else {
    return '';
  }
};

const getDateddMMyyyy = (date) => {
  let day = date.getDate();
  let monthIndex = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${(day + '').length == 1 ? '0' + day : day}-${(monthIndex + '').length == 1 ? '0' + monthIndex : monthIndex
    }-${year}`;
};

const getDateYYYYMMDD = (date) => {
  let day = new Date(date).getDate();
  let monthIndex = new Date(date).getMonth() + 1;
  let year = new Date(date).getFullYear();
  return `${year}-${(monthIndex + '').length == 1 ? '0' + monthIndex : monthIndex}-${(day + '').length == 1 ? '0' + day : day
    }`;
};
const ddMMYYYYtoStamp = (val) => {
  val = val ? val.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3') : new Date();
  return val ? val : new Date();
};
const getHeaders = () => {
  const authUser = JSON.parse(localStorage.getItem('user'));
  let formName = getFormName(); 
  
  let header = {
    'Accept-Language': 'en-US',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'api-key': process.env.NEXT_PUBLIC_API_KEY,
    'formname': formName
  };
  if (typeof authUser == 'object' && authUser && authUser.key) {
    header['AuthorizationKey'] = authUser.key;
  }
  return header;
};
 

const getFormName = () => {
  const authUser = JSON.parse(localStorage.getItem('user'));
  const pathname = window.location.pathname;
  let formName = "dashboard"; 

  if (authUser && authUser.userMenu.length > 0 && pathname !== '/') {
    authUser.userMenu.map(menu => {
      if (pathname == menu["url-link"]) {
        formName = menu["menu-name"];
      } else if (menu['menu-child'].length > 0) {
        menu['menu-child'].map(nestMenu => {
          if (pathname == nestMenu["url-link"]) {
            formName = nestMenu["menu-name"];
          } else if (nestMenu['menu-child'].length > 0) {
            nestMenu['menu-child'].map(nestMenu2 => {
              if (pathname == nestMenu2["url-link"]) {
                formName = nestMenu2["menu-name"];
              }
            });
          }
        });
      }
    });
  }

  return formName;
}

const httpPostRequestWithForm = (req) => {
  var formdata = new FormData();
  //,req[newConstants.FILE_PATH]
  formdata.append('uploaded-file', req[newConstants.UPLOAD_FILE]);
  formdata.append('doc-type-key', req[newConstants.DOC_TYPE_KEY]);
  formdata.append('form-name', req[newConstants.FORM_NAME]);

  let headers = getHeaders();
  delete headers['Accept'];
  delete headers['Content-Type'];
  headers['Accept-Language'] = 'zh-CN';
  // headers["Cookie"]=".TripWerkz-Admin-Portal-Session=CfDJ8EKbf%2BdsKtFOuezSi9AWxIxG9kGOTk7s3JinTbZhKJ1874eGEd19XEe2rrgX20RaQQ3o6TyVCP8GKdPT0kW84Axpwj7ecIsAQTiBhMHd969dcqVce8iVe%2FJt%2F8rb1%2FS%2BG4tTN%2BJgMy4zpNuCC5QweihA8gy7S9aU9xoHJznx2oy5";
  const requestBody = {
    method: 'POST',
    headers: headers,
    body: formdata,
  };
  return new Promise((resolve, reject) => {
    fetch(req[constants.URL], requestBody)
      .then((responseJson) => {
        resolve(responseJson.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const httpPostRequest = (req,key=null) => {
  let headers = getHeaders();
  if (req.skip_headers && req.skip_headers.length) {
    req.skip_headers.map((val, index) => {
      delete headers[val];
    });
  }

  if(key){
    headers['AuthorizationKey'] = key;
  }

  const requestBody = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(req[constants.PAY_LOAD]),
  };

  return new Promise((resolve, reject) => {
    fetch(req[constants.URL], requestBody)    
      .then((responseJson) => {
        resolve(responseJson.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const httpGetRequest = (req, isDeleteAuthKey = false) => {
  let headers = getHeaders();
  if (typeof req[constants.HEADERS] == 'object') {
    delete headers['Accept'];
    delete headers['Content-Type'];
    for (let h in req[constants.HEADERS]) {
      headers[h] = req[constants.HEADERS][h];
    }
    if (isDeleteAuthKey) {
      delete headers['AuthorizationKey'];
    }
  }

  const requestBody = {
    method: 'GET',
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    fetch(req[constants.URL], requestBody)
      .then((responseJson) => {
        if (headers.hasOwnProperty('Accept')) {
          resolve(responseJson.json());
        } else {
          resolve(responseJson.arrayBuffer());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};


const getQueryStringParams = (query) => {
  query = query.split('?').length > 1 ? query.split('?')[1] : query;
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
      let [key, value] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, {})
    : {};
};

const fetcher = (...arg) => fetch(...arg).then((res) => res.json());

const toLowerCase = (val) => {
  return val ? val.toLowerCase() : '';
};
const callToMobile = (mobile_no) => {
  if (mobile_no) {
    window.open('tel:' + mobile_no);
  }
};

const callWhatsApp = (mobile_no) => {
  if (mobile_no) {
    window.open('https://api.whatsapp.com/send?phone=+91' + mobile_no);
  }
};

const mapLocation = (lat, lng) => {
  if (lat && lng) {
    var url = 'https://www.google.com/maps/place/' + lat + ',' + lng;
    window.open(url);
  }
};

const openEmail = (mail) => {
  if (mail) {
    window.open('mailto:' + mail);
  }
};
const isEmail = (mail) => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);
};

const isMobile = (mobile) => {
  return /^(\+|\d)[0-9]{7,16}$/.test(mobile);
};

const splitNumberText = (inputText) => {
  var output = [];
  var json = inputText.split(' ');
  json.forEach(function (item) {
    output.push(item.replace(/\'/g, '').split(/(\d+)/).filter(Boolean));
  });
  return output[0];
};

const starRatingFinder = (key) => {
  key = key.split(' ');
  let index_of_star = key.findIndex((f) => f == 'STARS');
  let start = index_of_star > 0 ? parseInt(key[index_of_star - 1]) + (key.findIndex((f) => f == 'HALF') > 0 ? 0.5 : 0) : 0;
  return start;
};

const encodeUrl = (key) => {
  return encodeURI(key);
};
const decodeUrl = (key) => {
  return decodeURI(key);
};
const validator = (values) => {
  if (!values.length) {
    let err = false;
    for (let obj in values) {
      if (!values[obj]['type']) {
        if (
          typeof values[obj]['value'] != 'boolean' &&
          ((values[obj]['is_require'] && values[obj]['error']) ||
            (values[obj]['is_require'] &&
              (values[obj]['value'] == null ||
                values[obj]['value'] == '' ||
                (typeof values[obj]['value'] == 'string' && values[obj]['value'] && values[obj]['value'].trim() == ''))))
        ) {
          values[obj]['error'] = true;
          err = true;
        }
      } else {
        if (
          values[obj]['type'] != 'boolean' &&
          values[obj]['type'] != 'price' &&
          values[obj]['type'] != 'number' &&
          values[obj]['type'] != 'object' &&
          values[obj]['is_require'] &&
          values[obj]['value'] &&
          values[obj]['value'].trim() == ''
        ) {
          values[obj]['error'] = true;
          err = true;
          values[obj]['err_msg'] = 'Require field.';
        } else if (values[obj]['is_require']) {
          if (values[obj]['type'] == 'text') {
            if (
              !(
                values[obj]['value'] &&
                values[obj]['value'].trim().length >= values[obj]['min_length'] &&
                ((values[obj]['max_length'] &&
                  values[obj]['value'] &&
                  values[obj]['value'].trim().length <= values[obj]['max_length']) ||
                  values[obj]['max_length'] == null)
              )
            ) {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] =
                'Should contain min of ' +
                values[obj]['min_length'] +
                (values[obj]['max_length'] ? ' and max of ' + values[obj]['max_length'] : '') +
                ' characters.';
            }
          } else if (values[obj]['type'] == 'mobile_no') {
            if (!isMobile(values[obj]['value'])) {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] = 'Invalid entry.';
            }
          } else if (values[obj]['type'] == 'boolean') {
            if (values[obj]['value'] == null) {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] = 'Require field.';
            }
          } else if (values[obj]['type'] == 'dropdown') {
            if (values[obj]['value'] == null || values[obj]['value'] == '') {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] = 'Require field.';
            }
          } else if (values[obj]['type'] == 'email') {
            if (!isEmail(values[obj]['value'])) {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] = 'Invalid Email.';
            }
          } else if (values[obj]['type'] == 'price') {
            if (
              (values[obj]['value'] + '').trim().length == 0 ||
              (values[obj]['value'] < 0 && Math.sign(values[obj]['value']) == -1)
            ) {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] = 'Invalid Price';
            }
          } else if (values[obj]['type'] == 'number') {
            if (
              (values[obj]['value'] < 0 && Math.sign(values[obj]['value']) == -1) ||
              !values[obj]['value'] ||
              values[obj]['value'] % 1 != 0
            ) {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] = 'Invalid Number';
            }
          } else if (values[obj]['type'] == 'object') {
            if (
              typeof values[obj]['value'] != 'object' ||
              values[obj]['value'] == undefined ||
              values[obj]['value'] == null
            ) {
              values[obj]['error'] = true;
              err = true;
              values[obj]['err_msg'] = 'Invalid Input';
            }
          }
        }
      }
    }
    return { values, err };
  } else {
    values = values.map((value) => validator(value));
    return { values: values.map((f) => f.values), err: values.filter((f) => f.err).length > 0 };
  }
};
const paginate = (dataArray, pageSize, pageNumber) => {
  pageNumber = pageNumber <= 0 ? 1 : pageNumber;
  return dataArray.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
const filterPage = (dataArray, search_by_column, search_key = '') => {
  return dataArray.filter(
    (f) =>
      (search_key && search_key.length && f[search_by_column.toString()].search(search_key) > -1) || search_key.length == 0,
  );
};
const getMaxPageNumber = (dataArray, pageSize) => {
  return Math.ceil(dataArray.length / pageSize);
};
function addBookmark(url, title) {
  if (!url) {
    url = window.location;
  }
  if (!title) {
    title = document.title;
  }
  var browser = navigator.userAgent.toLowerCase();
  if (window.sidebar) {
    // Mozilla, Firefox, Netscape
    window.sidebar.addPanel(title, url, '');
  } else if (window.external) {
    // IE or chrome
    if (browser.indexOf('chrome') == -1) {
      // ie
      window.external.AddFavorite(url, title);
    } else {
      // chrome
      alert('Please Press CTRL+D (or Command+D for macs) to bookmark this page');
    }
  } else if (window.opera && window.print) {
    // Opera - automatically adds to sidebar if rel=sidebar in the tag
    return true;
  } else if (browser.indexOf('konqueror') != -1) {
    // Konqueror
    alert('Please press CTRL+B to bookmark this page.');
  } else if (browser.indexOf('webkit') != -1) {
    // safari
    alert('Please press CTRL+B (or Command+D for macs) to bookmark this page.');
  } else {
    alert('Your browser cannot add bookmarks using this link. Please add this link manually.');
  }
}
export {
  getMaxPageNumber,
  paginate,
  filterPage,
  validator,
  encodeUrl,
  decodeUrl,
  getHeaders,
  starRatingFinder,
  isEmail,
  httpGetRequest,
  splitNumberText,
  openEmail,
  mapLocation,
  callWhatsApp,
  callToMobile,
  getQueryStringParams,
  httpPostRequest,
  fetcher,
  getDateddMMMyyyy,
  toLowerCase,
  getDateddMMyyyy,
  getDateYYYYMMDD,
  ddMMYYYYtoStamp,
  httpPostRequestWithForm,
  addBookmark,
  useFocusNext
};
