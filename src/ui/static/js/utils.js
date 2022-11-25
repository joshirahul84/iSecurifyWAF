class Checkbox {
  constructor(container) {
    this.container = container;
    this.checkContainer = document.querySelector(`${this.container}`);
    this.init();
  }

  init() {
    this.checkContainer.addEventListener("click", (e) => {
      //checkbox click
      try {
        if (
          e.target.closest("div").hasAttribute("checkbox-handler") &&
          !e.target
            .closest("div")
            .querySelector('input[type="checkbox"]')
            .hasAttribute("disabled")
        ) {
          //change DOM
          const checkboxEl = e.target
            .closest("div")
            .querySelector('input[type="checkbox"]');
          checkboxEl.checked
            ? checkboxEl.setAttribute("value", "yes")
            : checkboxEl.setAttribute("value", "no");
        }
      } catch (err) {}
      //nested elements click
      try {
        if (
          e.target.closest("svg").hasAttribute("checkbox-handler") &&
          !e.target
            .closest("div")
            .querySelector('input[type="checkbox"]')
            .hasAttribute("disabled")
        ) {
          e.target
            .closest("div")
            .querySelector('input[type="checkbox"]')
            .click();
        }
      } catch (err) {}
    });
  }
}

class Select {
  constructor(container, prefixAtt) {
    this.prefix = prefixAtt;
    this.container = container;
    this.SelectContainer = document.querySelector(`${this.container}`);
    this.init();
  }

  init() {
    this.SelectContainer.addEventListener("click", (e) => {
      //SELECT BTN LOGIC
      try {
        if (
          e.target
            .closest("button")
            .hasAttribute(`${this.prefix}-setting-select`) &&
          !e.target.closest("button").hasAttribute(`disabled`)
        ) {
          this.toggleSelectBtn(e);
        }
      } catch (err) {}
      //SELECT DROPDOWN BTN LOGIC
      try {
        if (
          e.target
            .closest("button")
            .hasAttribute(`${this.prefix}-setting-select-dropdown-btn`)
        ) {
          const btn = e.target.closest("button");
          const btnValue = btn.getAttribute("value");
          const btnSetting = btn.getAttribute(
            `${this.prefix}-setting-select-dropdown-btn`
          );
          //add new value to custom
          const selectCustom = document.querySelector(
            `[${this.prefix}-setting-select="${btnSetting}"]`
          );
          selectCustom.querySelector(
            `[${this.prefix}-setting-select-text]`
          ).textContent = btnValue;
          //add selected to new value

          //change style
          const dropdownEl = document.querySelector(
            `[${this.prefix}-setting-select-dropdown="${btnSetting}"]`
          );
          dropdownEl.classList.add("hidden");
          dropdownEl.classList.remove("flex");

          //reset dropdown btns
          const btnEls = dropdownEl.querySelectorAll("button");

          btnEls.forEach((btn) => {
            btn.classList.remove(
              "dark:bg-primary",
              "bg-primary",
              "bg-primary",
              "text-gray-300",
              "text-gray-300"
            );
            btn.classList.add("bg-white", "dark:bg-slate-700", "text-gray-700");
          });
          //highlight clicked btn
          btn.classList.remove(
            "bg-white",
            "dark:bg-slate-700",
            "text-gray-700"
          );
          btn.classList.add("dark:bg-primary", "bg-primary", "text-gray-300");

          //close dropdown
          const dropdownChevron = document.querySelector(
            `svg[${this.prefix}-setting-select="${btnSetting}"]`
          );
          dropdownChevron.classList.remove("rotate-180");

          //update real select element
          this.updateSelected(
            document.querySelector(
              `[${this.prefix}-setting-select-default="${btnSetting}"]`
            ),
            btnValue
          );
        }
      } catch (err) {}
    });
  }

  updateSelected(selectEl, selectedValue) {
    const options = selectEl.querySelectorAll("option");
    //remove selected to all
    options.forEach((option) => {
      option.removeAttribute("selected");
      option.selected = false;
    });
    //select new one
    const newOption = selectEl.querySelector(
      `option[value="${selectedValue}"]`
    );
    newOption.selected = true;
    newOption.setAttribute("selected", "");
  }

  toggleSelectBtn(e) {
    const attribut = e.target
      .closest("button")
      .getAttribute(`${this.prefix}-setting-select`);
    //toggle dropdown
    const dropdownEl = document.querySelector(
      `[${this.prefix}-setting-select-dropdown="${attribut}"]`
    );
    const dropdownChevron = document.querySelector(
      `svg[${this.prefix}-setting-select="${attribut}"]`
    );
    dropdownEl.classList.toggle("hidden");
    dropdownEl.classList.toggle("flex");
    dropdownChevron.classList.toggle("rotate-180");
  }
}

class Popover {
  constructor(container, prefix) {
    this.prefix = prefix;
    this.container = container;
    this.popoverContainer = document.querySelector(`${this.container}`);
    this.init();
  }

  init() {
    let popoverCount = 0; //for auto hide
    let btnPopoverAtt = ""; //to manage info btn clicked

    this.popoverContainer.addEventListener("click", (e) => {
      //POPOVER LOGIC
      try {
        if (e.target.closest("svg").hasAttribute(`${this.prefix}-info-btn`)) {
          const btnPop = e.target.closest("svg");
          //toggle curr popover
          const popover = btnPop.parentElement.querySelector(
            `[${this.prefix}-info-popover]`
          );
          popover.classList.toggle("hidden");

          //get a btn att if none
          if (btnPopoverAtt === "")
            btnPopoverAtt = btnPop.getAttribute(`${this.prefix}-info-btn`);

          //compare prev btn and curr
          //hide prev popover if not the same
          if (
            btnPopoverAtt !== "" &&
            btnPopoverAtt !== btnPop.getAttribute(`${this.prefix}-info-btn`)
          ) {
            const prevPopover = document.querySelector(
              `[${this.prefix}-info-popover="${btnPopoverAtt}"]`
            );
            prevPopover.classList.add("hidden");
            btnPopoverAtt = btnPop.getAttribute(`${this.prefix}-info-btn`);
          }

          //hide popover after an amount of time
          popoverCount++;
          const currCount = popoverCount;
          setTimeout(() => {
            //if another click on same infoBtn, restart hidden
            if (currCount === popoverCount) popover.classList.add("hidden");
          }, 3000);
        }
      } catch (err) {}
    });
  }
}

class Tabs {
  constructor(container, prefix) {
    this.prefix = prefix;
    this.container = container;
    this.tabsContainer = document.querySelector(`${this.container}`);

    this.mobileBtn = document.querySelector(`[${this.prefix}-mobile-select]`);
    this.mobileBtnTxt = this.mobileBtn.querySelector(`span`);
    this.mobileBtnSVG = document.querySelector(
      `[${this.prefix}-mobile-chevron]`
    );
    this.mobileDropdown = document.querySelector(
      `[${this.prefix}-mobile-dropdown]`
    );
    this.mobileDropdownEls = this.mobileDropdown.querySelectorAll(`button`);
    this.mobileBtn.addEventListener(`click`, this.toggleDropdown.bind(this));
    //FORM
    this.settingContainers = document.querySelectorAll(`[${this.prefix}-item]`);
    this.generalSettings = document.querySelector(
      `[${this.prefix}-item='general']`
    );
    this.initTabs();
    this.initDisplay();
  }

  initTabs() {
    this.tabsContainer.addEventListener("click", (e) => {
      //MOBILE TABS LOGIC
      try {
        if (
          !e.target.hasAttribute(`${this.prefix}-mobile-info-btn`) &&
          e.target.hasAttribute(`${this.prefix}-mobile-item-handler`)
        ) {
          //change text to select btn
          const tab = e.target.closest("button");
          const tabAtt = tab.getAttribute(`${this.prefix}-mobile-item-handler`);
          this.mobileBtnTxt.textContent = tab.childNodes[0].textContent;
          //reset all tabs style
          this.mobileDropdownEls.forEach((item) => {
            item.classList.add(
              "bg-white",
              "dark:bg-slate-700",
              "text-gray-700"
            );
            item.classList.remove(
              "dark:bg-primary",
              "bg-primary",
              "bg-primary",
              "text-gray-300",
              "text-gray-300"
            );
          });
          //highlight chosen one
          tab.classList.add("dark:bg-primary", "bg-primary", "text-gray-300");
          tab.classList.remove(
            "bg-white",
            "dark:bg-slate-700",
            "text-gray-700"
          );
          //show settings
          this.showRightSetting(tabAtt);
          //close dropdown
          this.toggleDropdown();
        }
      } catch (err) {}
      //DESKTOP TABS LOGIC
      try {
        if (
          !e.target.hasAttribute(`${this.prefix}-info-btn`) &&
          e.target.closest("button").hasAttribute(`${this.prefix}-item-handler`)
        ) {
          const tab = e.target.closest("button");
          const tabAtt = tab.getAttribute(`${this.prefix}-item-handler`);
          this.showRightSetting(tabAtt);
        }
      } catch (err) {}
    });
  }

  initDisplay() {
    //show general setting or
    //first setting list if doesn't exist (like in services)
    //on mobile and desktop
    if (this.generalSettings === null) {
      //desktop
      document
        .querySelector(
          `[${this.prefix}-tabs-desktop] [${this.prefix}-item-handler]`
        )
        .click();
      //mobile
      document
        .querySelector(
          `[${this.prefix}-tabs-mobile] [${this.prefix}-mobile-item-handler]`
        )
        .click();
      this.toggleDropdown();
    }
  }

  showRightSetting(tabAtt) {
    this.settingContainers.forEach((container) => {
      if (container.getAttribute(`${this.prefix}-item`) === tabAtt)
        container.classList.remove("hidden");
      if (container.getAttribute(`${this.prefix}-item`) !== tabAtt)
        container.classList.add("hidden");
    });
  }

  toggleDropdown() {
    this.mobileDropdown.classList.toggle("hidden");
    this.mobileDropdown.classList.toggle("flex");
    this.mobileBtnSVG.classList.toggle("rotate-180");
  }
}

class FolderNav {
  constructor(prefix) {
    this.prefix = prefix;
    this.breadContainer = document.querySelector(`[${this.prefix}-breadcrumb]`);
    this.container = document.querySelector(`[${this.prefix}-container]`);
    this.listContainer = document.querySelector(`[${this.prefix}-folders]`);
    this.els = document.querySelectorAll(`div[${this.prefix}-element]`);
    this.files = document.querySelectorAll(
      `div[${this.prefix}-element][_type='file']`
    );
    this.addFileEl = document.querySelector(`[${this.prefix}-add-file]`);
    this.addFolderEl = document.querySelector(`[${this.prefix}-add-folder]`);
    this.initSorted();
    this.initNav();
  }

  //sorted elements to get folders first
  initSorted() {
    this.files.forEach((file) => {
      this.listContainer.append(file);
    });
  }

  initNav() {
    this.container.addEventListener("click", (e) => {
      //GO ON NESTED FOLDER
      try {
        if (e.target.closest("div").getAttribute("_type") === "folder") {
          //avoid logic on action btn click
          const folder = e.target.closest("div[_type='folder']");
          this.updatedNested(folder);
        }
      } catch (err) {}
      //BREACRUMB ITEM
      try {
        if (
          e.target
            .closest("li")
            .hasAttribute(`${this.prefix}-breadcrumb-item`) &&
          !e.target.closest("li").hasAttribute(`${this.prefix}-back`) &&
          e.target.closest("li").nextSibling !== null
        ) {
          const breadItem = e.target.closest("li");
          this.updateBread(breadItem);
        }
      } catch (err) {}
      //BREADCRUMB BACK LOGIC
      try {
        if (
          e.target.closest("li").hasAttribute(`${this.prefix}-back`) &&
          +this.breadContainer.lastElementChild.getAttribute("level") !== 0
        ) {
          //back is like clicking on last prev element
          const prevItem =
            this.breadContainer.lastElementChild.previousElementSibling;
          this.updateBread(prevItem);
        }
      } catch (err) {}
    });
  }

  //go to nested folder element
  updatedNested(folder) {
    const [folderPath, folderLvl, folderTxt] = this.getElAtt(folder);
    //hidden all
    this.hiddenConfEls();
    //show every files in folder
    this.showCurrentFolderEls(folderPath, +folderLvl);
    //update breadcrumb
    this.appendBreadItem(folderPath, folderLvl, folderTxt);
    //update actions
    this.updateActions(folder);
  }

  //update clicked bread and check for allow add conf
  updateBread(item) {
    const [prevPath, prevLvl, prevTxt] = this.getElAtt(item);
    this.hiddenConfEls();
    //show every files in folder
    this.showCurrentFolderEls(prevPath, +prevLvl);
    //remove useless bread
    this.removeBreadElByLvl(+prevLvl);
    const folder = document.querySelector(
      `div[${this.prefix}-element][path='${item.getAttribute("path")}']`
    );
    this.updateActions(folder);
  }

  //check if file/folder can be created on folder
  updateActions(folder) {
    //by default
    this.hideAddConf();
    //check if folder allow add file/folder
    const isAddFile = folder.getAttribute("can-create-file");
    const isAddFolder = folder.getAttribute("can-create-folder");
    isAddFile === "True" ? this.addFileEl.classList.remove("hidden") : "";
    isAddFolder === "True" ? this.addFolderEl.classList.remove("hidden") : "";
  }

  hideAddConf() {
    this.addFileEl.classList.add("hidden");
    this.addFolderEl.classList.add("hidden");
  }

  showCurrentFolderEls(path, lvl) {
    const nestedEl = document.querySelectorAll(
      `div[path^="${path}/"][level="${+lvl + 1}"]`
    );
    for (let i = 0; i < nestedEl.length; i++) {
      const el = nestedEl[i];
      el.setAttribute("current-el", "");
      el.classList.remove("hidden");
    }
  }

  //remove the bread items with a higher level than
  //the clicked bread item
  removeBreadElByLvl(lvl) {
    const breadcrumbItem = this.breadContainer.querySelectorAll(
      `[${this.prefix}-breadcrumb-item]`
    );
    breadcrumbItem.forEach((item) => {
      if (item.hasAttribute("level") && +item.getAttribute("level") > lvl)
        item.remove();
    });
  }

  //retrieve path, level and text
  getElAtt(el) {
    const newPath = el.getAttribute("path");
    const newLvl = el.getAttribute("level");
    const newTxt = el.getAttribute("name");
    return [newPath, newLvl, newTxt];
  }

  //hidden all folders
  hiddenConfEls() {
    this.els.forEach((el) => {
      el.classList.add("hidden");
      el.removeAttribute("current-el");
    });
  }

  //add a bread item as last child with needed info
  appendBreadItem(path, level, name) {
    //create item el
    const itemEl = document.createElement("li");
    itemEl.className = "leading-normal text-sm";
    //set item atts
    const itemAtt = [
      ["path", path],
      [`${this.prefix}-breadcrumb-item`, ""],
      ["level", level],
      ["name", name],
    ];
    for (let i = 0; i < itemAtt.length; i++) {
      itemEl.setAttribute(`${itemAtt[i][0]}`, `${itemAtt[i][1]}`);
    }
    //create nested btn el
    const nestedBtnEl = document.createElement("button");
    nestedBtnEl.className =
      "ml-2 dark:text-white dark:opacity-50 text-gray-700 opacity-50 after:float-right after:pl-2 after:text-gray-600 after:content-['/']";
    itemEl.appendChild(nestedBtnEl);
    nestedBtnEl.setAttribute("type", "button");
    nestedBtnEl.textContent = name;
    this.breadContainer.appendChild(itemEl);
  }
}

class FolderDropdown {
  constructor(prefix) {
    this.prefix = prefix;
    this.container = document.querySelector(`[${this.prefix}-container]`);
    this.dropEls = document.querySelectorAll(
      `[${this.prefix}-action-dropdown]`
    );
    this.init();
  }

  init() {
    let prevActionBtn = ""; //compare with curr to hide or not prev
    this.container.addEventListener("click", (e) => {
      //show dropdown actions for folders
      try {
        if (
          e.target.closest("div").hasAttribute(`${this.prefix}-action-button`)
        ) {
          const att = e.target
            .closest("div")
            .getAttribute(`${this.prefix}-action-button`);
          const dropEl = document.querySelector(
            `[${this.prefix}-action-dropdown="${att}"]`
          );
          //avoid multiple dropdown
          if (prevActionBtn === "") prevActionBtn = dropEl;
          if (prevActionBtn !== dropEl) this.hideDropEls();
          this.toggleDrop(dropEl);
          prevActionBtn = dropEl;
        }
      } catch (err) {}
      //hide dropdown clicking an action
      try {
        if (
          e.target
            .closest("button")
            .hasAttribute(`${this.prefix}-action-dropdown-btn`)
        ) {
          const att = e.target
            .closest("button")
            .getAttribute(`${this.prefix}-action-dropdown-btn`);
          const dropEl = document.querySelector(
            `[${this.prefix}-action-dropdown="${att}"]`
          );
          this.hideDrop(dropEl);
        }
      } catch (err) {}
    });
  }

  //UTILS

  toggleDrop(dropEl) {
    dropEl.classList.toggle("hidden");
    dropEl.classList.toggle("flex");
  }

  hideDrop(dropEl) {
    dropEl.classList.add("hidden");
    dropEl.classList.remove("flex");
  }

  hideDropEls() {
    this.dropEls.forEach((drop) => {
      this.hideDrop(drop);
    });
  }
}

class FolderEditor {
  constructor() {
    this.editor = ace.edit("editor");
    this.darkMode = document.querySelector("[dark-toggle]");
    this.initEditor();
    this.listenDarkToggle();
  }

  initEditor() {
    //editor options
    this.editor.setShowPrintMargin(false);
    this.darkModeBool(false);
  }

  //listen to dark toggle button to change theme
  listenDarkToggle() {
    this.darkMode.addEventListener("click", (e) => {
      this.darkMode.checked
        ? this.darkModeBool(true)
        : this.darkModeBool(false);
    });
  }

  //change theme according to mode
  darkModeBool(bool) {
    bool
      ? this.editor.setTheme("ace/theme/twilight")
      : this.editor.setTheme("ace/theme/cloud9_day");
  }

  readOnlyBool(bool) {
    this.editor.setReadOnly(bool);
  }
}

class FolderModal {
  constructor(prefix) {
    this.prefix = prefix;
    //container
    this.container = document.querySelector(`[${this.prefix}-container]`);
    //add service/file elements
    this.breadContainer = document.querySelector(`[${this.prefix}-breadcrumb]`);
    this.addConfContainer = document.querySelector(
      `[${this.prefix}-add-container]`
    );
    //modal DOM elements
    this.form = document.querySelector(`[${this.prefix}-modal-form]`);
    this.modalEl = document.querySelector(`[${this.prefix}-modal]`);
    this.modalTitle = this.modalEl.querySelector(
      `[${this.prefix}-modal-title]`
    );
    this.modalPath = this.modalEl.querySelector(`[${this.prefix}-modal-path]`);
    this.modalEditor = this.modalEl.querySelector(
      `[${this.prefix}-modal-editor]`
    );
    this.modalPathPrev = this.modalPath.querySelector(
      `p[${this.prefix}-modal-path-prefix]`
    );
    this.modalPathName = this.modalPath.querySelector("input");
    this.modalPathSuffix = this.modalPath.querySelector(
      `p[${this.prefix}-modal-path-suffix]`
    );

    this.modalSubmit = this.modalEl.querySelector(
      `[${this.prefix}-modal-submit]`
    );
    //hidden input for backend
    this.modalInpPath = this.modalEl.querySelector("#path");
    this.modalInpOperation = this.modalEl.querySelector("#operation");
    this.modalInpType = this.modalEl.querySelector("#_type");
    this.modalInpOldName = this.modalEl.querySelector("#old_name");
    this.modalTxtarea = this.modalEl.querySelector("#content");
    //HANDLERS
    //modal and values logic after clicking add file/folder button
    this.initAddConfig();
    //modal and values logic after clicking actions buttons
    this.initActionToModal();
    //modal element logic
    this.initModal();
    //modal submit check and filter before submit
    this.initForm();
  }

  //HANDLERS
  initAddConfig() {
    this.addConfContainer.addEventListener("click", (e) => {
      //add folder
      try {
        if (e.target.closest("li").hasAttribute(`${this.prefix}-add-folder`)) {
          this.setModal("new", this.getPathFromBread(), "folder", "");
        }
      } catch (err) {}
      //add file
      try {
        if (e.target.closest("li").hasAttribute(`${this.prefix}-add-file`)) {
          this.setModal("new", this.getPathFromBread(), "file", "");
        }
      } catch (err) {}
    });
  }

  initActionToModal() {
    this.container.addEventListener("click", (e) => {
      //click on file logic
      try {
        if (e.target.closest("div").getAttribute("_type") == "file") {
          const btnEl = e.target
            .closest("div")
            .querySelector('button[value="view"]');
          const [action, path, type, content, name, level] =
            this.getInfoFromActionBtn(btnEl);
          this.setModal(action, path, type, content, name, level);
          this.showModal();
        }
      } catch (err) {}
      //set data of folder and show modal unless it's download btn
      try {
        if (
          e.target
            .closest("button")
            .hasAttribute(`${this.prefix}-action-dropdown-btn`) &&
          e.target.closest("button").getAttribute("value") !== "download"
        ) {
          const btnEl = e.target.closest("button");
          const [action, path, type, content, name, level] =
            this.getInfoFromActionBtn(btnEl);
          this.setModal(action, path, type, content, name, level);
          this.showModal();
        }
      } catch (err) {}
      //download btn logic
      try {
        if (
          e.target
            .closest("button")
            .hasAttribute(`${this.prefix}-action-dropdown-btn`) &&
          e.target.closest("button").getAttribute("value") === "download"
        ) {
          const btnEl = e.target.closest("button");
          const [action, path, type, content, name, level] =
            this.getInfoFromActionBtn(btnEl);
          this.download(name, content);
        }
      } catch (err) {}
    });
  }

  initModal() {
    this.modalEl.addEventListener("click", (e) => {
      //close modal logic
      try {
        if (
          e.target.closest("button").hasAttribute(`${this.prefix}-modal-close`)
        ) {
          this.closeModal();
        }
      } catch (err) {}
    });
  }

  download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  initForm() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      //submit nothing case
      if (this.modalInpOperation.value === "view") {
        return this.closeModal();
      }
      //else set data to input and request
      this.setDataForRequest();
    });
  }

  //get data of custom inputs and set it on submit input
  setDataForRequest() {
    //set path to input
    const prevPath = this.modalPathPrev.textContent;
    const name = this.modalPathName.value;
    const newPath = `${prevPath}${name}`;
    this.modalInpPath.value = newPath;
    //set textarea value from editor
    const newTextarea = ace.edit("editor").getValue();
    this.modalTxtarea.value = newTextarea;
    this.form.submit();
  }

  //for add file/folder btn
  //get path of last bread element
  getPathFromBread() {
    const path = this.breadContainer.lastElementChild.getAttribute("path");
    return `${path}/`;
  }

  //set all needed data from btn action and folder info
  setModal(action, path, type, content, name, level) {
    //title
    this.modalTitle.textContent = `${action} ${type}`;
    this.setInpt(action, path, type, name);
    this.setEditor(type, content);
    this.setSubmitTxt(action);
    this.setPath(action, path, type, name, level);
    this.setDisabled(action);
    this.showModal();
  }

  //for hidden input to send on backend
  //on form submit, check for update values before send request
  setInpt(action, path, type, name) {
    this.modalInpPath.value =
      type === "file" && this.prefix === "configs"
        ? path.replace(".conf", "")
        : path;
    this.modalInpType.value = type;
    this.modalInpOperation.value = action;
    this.modalInpOldName.value =
      type === "file" && this.prefix === "configs"
        ? name.replace(".conf", "")
        : name;
  }

  //path is empty if new one, else show current name
  setPath(action, path, type) {
    let [prevPath, name] = this.separatePath(path);
    //remove conf if file type
    this.modalPathSuffix.textContent =
      type === "file" && this.prefix === "configs" ? ".conf" : "";
    name =
      type === "file" && this.prefix === "configs"
        ? name.replace(".conf", "")
        : name;

    if (action === "new") {
      this.modalPathPrev.textContent = `${path}`;
      this.modalPathName.value = ``;
    }

    if (action !== "new") {
      this.modalPathPrev.textContent = `${prevPath}`;
      this.modalPathName.value = `${name}`;
    }
  }

  //separate name and previous of path for DOM elements
  separatePath(path) {
    const splitPath = path.split("/");
    const nme = splitPath[splitPath.length - 1];
    const prev = path.replace(nme, "");
    return [prev, nme];
  }

  //disabled for view and delete actions
  setDisabled(action) {
    action === "view" || action === "delete" || action === "download"
      ? this.disabledDOMInpt(true)
      : this.disabledDOMInpt(false);
  }

  //submit text depending action
  setSubmitTxt(action) {
    if (action === "new") return (this.modalSubmit.textContent = "add");
    if (action === "view") return (this.modalSubmit.textContent = "ok");
    if (action === "edit") return (this.modalSubmit.textContent = "edit");
    if (action === "delete") return (this.modalSubmit.textContent = "delete");
    if (action === "download")
      return (this.modalSubmit.textContent = "download");
  }

  //show only if type file and display text
  setEditor(type, content) {
    //SHOW LOGIC
    if (type === "folder") this.modalEditor.classList.add("hidden");

    if (type === "file") this.modalEditor.classList.remove("hidden");

    ace.edit("editor").setValue(content);
  }

  //get all needed info when clicking on action btn
  getInfoFromActionBtn(btnEl) {
    const action = btnEl.getAttribute("value");
    const name = btnEl.getAttribute(`${this.prefix}-action-dropdown-btn`);
    const folder = document.querySelector(`[${this.prefix}-element='${name}']`);
    const level = folder.getAttribute("level");
    const path = folder.getAttribute("path");
    const type = folder.getAttribute("_type");
    let content;
    try {
      content = folder
        .querySelector(`[${this.prefix}-content]`)
        .getAttribute("value");
    } catch (err) {
      content = "";
    }
    return [action, path, type, content, name, level];
  }

  //UTILS
  disabledDOMInpt(bool) {
    this.modalPathName.disabled = bool;
    ace.edit("editor").setReadOnly(bool);
  }

  closeModal() {
    this.modalEl.classList.add("hidden");
    this.modalEl.classList.remove("flex");
  }

  showModal() {
    this.modalEl.classList.add("flex");
    this.modalEl.classList.remove("hidden");
  }
}

class FormatValue {
  constructor() {
    this.inputs = document.querySelectorAll("[value]");
    this.init();
  }

  init() {
    this.inputs.forEach((inp) => {
      inp.setAttribute("value", inp.getAttribute("value").trim());
    });
  }
}

class Loader {
  constructor() {
    this.menuContainer = document.querySelector("[menu-container]");
    this.logoContainer = document.querySelector("[loader]");
    this.logoEl = document.querySelector("[loader-img]");
    this.isLoading = true;
    this.init();
  }

  init() {
    this.loading();
    window.addEventListener("load", (e) => {
      setTimeout(() => {
        this.logoContainer.classList.add("opacity-0");
      }, 350);

      setTimeout(() => {
        this.isLoading = false;
        this.logoContainer.classList.add("hidden");
      }, 650);

      setTimeout(() => {
        this.logoContainer.remove();
      }, 800);
    });
  }

  loading() {
    if ((this.isLoading = true)) {
      setTimeout(() => {
        this.logoEl.classList.toggle("scale-105");
        this.loading();
      }, 300);
    }
  }
}

export {
  Checkbox,
  Popover,
  Select,
  Tabs,
  FolderNav,
  FolderModal,
  FolderEditor,
  FolderDropdown,
  FormatValue,
  Loader,
};