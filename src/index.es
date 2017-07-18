import { qS, qSA } from 'dompack/extra/qsa';

//FIXME: we are now using an old version (1.3), but the newest list.js can't be loaded somehow... find out why!
require('../node_modules/list.js/dist/list.js');
const ListPagination = require('./list.pagination.js'); // derived from NPM package, added some functions

let orgList = null;

export function setupNewsPage(options) {
  if (!qS('#newslist'))
    return;

// options: containerId, delayedLoadImages, classImage, numPerPage
// classImage only needed when delayedLoadImages = true (set images using data-src instead of src)

   //FIXME: (some) overrideable options

   //FIXME: Handle delayedLoadImages properly, not sure it works like it should (eg false => show, true => begin with src empty)

   //FIXME: add option to show nav bar at the bottom as well?
   //FIXME: add option to disable page navigation and just show everything


  options = {
    delayedLoadImages: true,
    classImage: 'news__image',
    numPerPage: 3,
    paginationOptions:
      { paginationClass: 'pagenav__pages',
        left: 1,
        right: 1,
        innerWindow: 2,
      },
   };

  if (options.delayedLoadImages === false) {
    console.error('FIXME: show images immediately');
  }

  // disable 'previous page' link
  qSA('.pagenav__link--prev').forEach(link => {
    link.classList.add('disabled');
  });

  let listOptions = {
    page: options.numPerPage,
    plugins: [ ListPagination(options.paginationOptions),
             ]
  }

  // init a new List
  orgList = new List('newslist', listOptions);

  // prev & next click handlers
  qSA('.pagenav__link--prev').forEach(link => { setPrevNextClick(options, link, false); });
  qSA('.pagenav__link--next').forEach(link => { setPrevNextClick(options, link, true); });

  // react on list changes
  orgList.on('updated', function() {
    window.setTimeout(() => {
      if (options.delayedLoadImages)
        loadImages(options);

      updatePagination(options);
    }, 50); // prevents race condition problems
  });

  if (options.delayedLoadImages)
    loadImages(options);

  updatePagination(options);

  qS('#newslist').style.display = 'block';

  return orgList;
}

function setPrevNextClick(options, link, isNext) {
  link.addEventListener('click', evt => {
    evt.preventDefault();

    if (isNext)
      orgList.pagination.goToNextPage();
    else
      orgList.pagination.goToPreviousPage();

    updatePagination(options);
  });
}

// updates state of prev/next links
function updatePagination(options) {
  if (!orgList.pagination)
    return;

  const status = orgList.pagination.getPaginationStatus();

  qSA('.pagenav__link--prev').forEach(link => {
    link.classList.toggle('disabled', status.currentPageIdx < 1);
  });

  qSA('.pagenav__link--next').forEach(link => {
    link.classList.toggle('disabled', status.currentPage === status.nrPages);
  });
}

// for all visible items, set image source from data-src if not already fetched
function loadImages(options) {
  for (const item of orgList.visibleItems) {
    let logo = item.elm.querySelector('.news__image');
    if (!logo)
      continue;

    let src = logo.getAttribute('src');
    if (src && src !== '') // already set
      continue;

    logo.setAttribute('src', logo.getAttribute('data-src'));
  }
}
