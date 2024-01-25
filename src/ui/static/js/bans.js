class Filter {
  constructor(prefix = "bans") {
    this.prefix = prefix;
    this.container = document.querySelector(`[data-${this.prefix}-filter]`);
    this.keyInp = document.querySelector("input#keyword");
    this.termValue = "all";
    this.reasonValue = "all";
    this.initHandler();
  }

  initHandler() {
    // REASON HANDLER
    this.container.addEventListener("click", (e) => {
      try {
        if (
          e.target
            .closest("button")
            .getAttribute(`data-${this.prefix}-setting-select-dropdown-btn`) ===
          "reason"
        ) {
          setTimeout(() => {
            const value = document
              .querySelector(
                `[data-${this.prefix}-setting-select-text="reason"]`,
              )
              .textContent.trim();

            this.reasonValue = value;
            //run filter
            this.filter();
          }, 10);
        }
      } catch (err) {}
    });
    // TERM HANDLER
    this.container.addEventListener("click", (e) => {
      try {
        if (
          e.target
            .closest("button")
            .getAttribute(`data-${this.prefix}-setting-select-dropdown-btn`) ===
          "term"
        ) {
          setTimeout(() => {
            const value = document
              .querySelector(`[data-${this.prefix}-setting-select-text="term"]`)
              .textContent.trim();

            this.termValue = value;
            //run filter
            this.filter();
          }, 10);
        }
      } catch (err) {}
    });
    //KEYWORD HANDLER
    this.keyInp.addEventListener("input", (e) => {
      this.filter();
    });
  }

  filter() {
    const bans = document.querySelector(`[data-${this.prefix}-list]`).children;
    if (bans.length === 0) return;
    //reset
    for (let i = 0; i < bans.length; i++) {
      const el = bans[i];
      el.classList.remove("hidden");
    }
    //filter type
    this.setFilterKeyword(bans);
    this.setFilterReason(bans);
    this.setFilterTerm(bans);
  }

  setFilterKeyword(bans) {
    const keyword = this.keyInp.value.trim().toLowerCase();
    if (!keyword) return;
    for (let i = 0; i < bans.length; i++) {
      const el = bans[i];

      const ip = this.getElAttribut(el, "ip");
      const banStart = this.getElAttribut(el, "ban_sart");
      const banEnd = this.getElAttribut(el, "ban_end");
      const remain = this.getElAttribut(el, "remain");

      if (
        !ip.includes(keyword) &&
        !banStart.includes(keyword) &&
        !banEnd.includes(keyword) &&
        !remain.includes(keyword)
      )
        el.classList.add("hidden");
    }
  }

  setFilterTerm(bans) {
    if (this.termValue === "all") return;
    for (let i = 0; i < bans.length; i++) {
      const el = bans[i];
      const type = this.getElAttribut(el, "term");
      if (type !== this.termValue) el.classList.add("hidden");
    }
  }

  setFilterReason(bans) {
    if (this.reasonValue === "all") return;
    for (let i = 0; i < bans.length; i++) {
      const el = bans[i];
      const type = this.getElAttribut(el, "reason");
      if (type !== this.reasonValue) el.classList.add("hidden");
    }
  }

  getElAttribut(el, attr) {
    return el
      .querySelector(`[data-${this.prefix}-${attr}]`)
      .getAttribute(`data-${this.prefix}-${attr}`)
      .trim();
  }
}

class Dropdown {
  constructor(prefix = "bans") {
    this.prefix = prefix;
    this.container = document.querySelector("main");
    this.lastDrop = "";
    this.initDropdown();
  }

  initDropdown() {
    this.container.addEventListener("click", (e) => {
      //SELECT BTN LOGIC
      try {
        if (
          e.target
            .closest("button")
            .hasAttribute(`data-${this.prefix}-setting-select`) &&
          !e.target.closest("button").hasAttribute(`disabled`)
        ) {
          const btnName = e.target
            .closest("button")
            .getAttribute(`data-${this.prefix}-setting-select`);
          if (this.lastDrop !== btnName) {
            this.lastDrop = btnName;
            this.closeAllDrop();
          }

          this.toggleSelectBtn(e);
        }
      } catch (err) {}
      //SELECT DROPDOWN BTN LOGIC
      try {
        if (
          e.target
            .closest("button")
            .hasAttribute(`data-${this.prefix}-setting-select-dropdown-btn`)
        ) {
          const btn = e.target.closest("button");
          const btnValue = btn.getAttribute("value");
          const btnSetting = btn.getAttribute(
            `data-${this.prefix}-setting-select-dropdown-btn`,
          );
          //stop if same value to avoid new fetching
          const isSameVal = this.isSameValue(btnSetting, btnValue);
          if (isSameVal) return this.hideDropdown(btnSetting);
          //else, add new value to custom
          this.setSelectNewValue(btnSetting, btnValue);
          //close dropdown and change style
          this.hideDropdown(btnSetting);

          if (
            !e.target.closest("button").hasAttribute(`data-${this.prefix}-file`)
          ) {
            this.changeDropBtnStyle(btnSetting, btn);
          }
          //show / hide filter
          if (btnSetting === "instances") {
            this.hideFilterOnLocal(btn.getAttribute("data-_type"));
          }
        }
      } catch (err) {}
    });
  }

  closeAllDrop() {
    const drops = document.querySelectorAll(
      `[data-${this.prefix}-setting-select-dropdown]`,
    );
    drops.forEach((drop) => {
      drop.classList.add("hidden");
      drop.classList.remove("flex");
      document
        .querySelector(
          `svg[data-${this.prefix}-setting-select="${drop.getAttribute(
            `data-${this.prefix}-setting-select-dropdown`,
          )}"]`,
        )
        .classList.remove("rotate-180");
    });
  }

  isSameValue(btnSetting, value) {
    const selectCustom = document.querySelector(
      `[data-${this.prefix}-setting-select-text="${btnSetting}"]`,
    );
    const currVal = selectCustom.textContent;
    return currVal === value ? true : false;
  }

  setSelectNewValue(btnSetting, value) {
    const selectCustom = document.querySelector(
      `[data-${this.prefix}-setting-select="${btnSetting}"]`,
    );
    selectCustom.querySelector(
      `[data-${this.prefix}-setting-select-text]`,
    ).textContent = value;
  }

  hideDropdown(btnSetting) {
    //hide dropdown
    const dropdownEl = document.querySelector(
      `[data-${this.prefix}-setting-select-dropdown="${btnSetting}"]`,
    );
    dropdownEl.classList.add("hidden");
    dropdownEl.classList.remove("flex");
    //svg effect
    const dropdownChevron = document.querySelector(
      `svg[data-${this.prefix}-setting-select="${btnSetting}"]`,
    );
    dropdownChevron.classList.remove("rotate-180");
  }

  changeDropBtnStyle(btnSetting, selectedBtn) {
    const dropdownEl = document.querySelector(
      `[data-${this.prefix}-setting-select-dropdown="${btnSetting}"]`,
    );
    //reset dropdown btns
    const btnEls = dropdownEl.querySelectorAll("button");

    btnEls.forEach((btn) => {
      btn.classList.remove(
        "bg-primary",
        "dark:bg-primary",
        "text-gray-300",
        "text-gray-300",
      );
      btn.classList.add("bg-white", "dark:bg-slate-700", "text-gray-700");
    });
    //highlight clicked btn
    selectedBtn.classList.remove(
      "bg-white",
      "dark:bg-slate-700",
      "text-gray-700",
    );
    selectedBtn.classList.add("dark:bg-primary", "bg-primary", "text-gray-300");
  }

  toggleSelectBtn(e) {
    const attribute = e.target
      .closest("button")
      .getAttribute(`data-${this.prefix}-setting-select`);
    //toggle dropdown
    const dropdownEl = document.querySelector(
      `[data-${this.prefix}-setting-select-dropdown="${attribute}"]`,
    );
    const dropdownChevron = document.querySelector(
      `svg[data-${this.prefix}-setting-select="${attribute}"]`,
    );
    dropdownEl.classList.toggle("hidden");
    dropdownEl.classList.toggle("flex");
    dropdownChevron.classList.toggle("rotate-180");
  }

  //hide date filter on local
  hideFilterOnLocal(type) {
    if (type === "local") {
      this.hideInp(`input#from-date`);
      this.hideInp(`input#to-date`);
    }

    if (type !== "local") {
      this.showInp(`input#from-date`);
      this.showInp(`input#to-date`);
    }
  }

  showInp(selector) {
    document.querySelector(selector).closest("div").classList.add("flex");
    document.querySelector(selector).closest("div").classList.remove("hidden");
  }

  hideInp(selector) {
    document.querySelector(selector).closest("div").classList.add("hidden");
    document.querySelector(selector).closest("div").classList.remove("flex");
  }
}

class Unban {
  constructor(prefix = "bans") {
    this.prefix = prefix;
    this.container = document.querySelector("main");
    this.listEl = document.querySelector(`[data-${this.prefix}-list]`);
    this.unbanForm = document.querySelector("#unban-items");
    this.unbanBtn = document.querySelector(`button[data-unban-btn]`);
    this.unbanInp = document.querySelector(`input[data-unban-inp]`);
    this.init();
  }

  init() {
    //  Look if an item is select to enable unban button
    this.container.addEventListener("click", (e) => {
      try {
        if (
          e.target.closest("div").hasAttribute(`data-${this.prefix}-ban-select`)
        ) {
          // timeout to wait for select value to change
          setTimeout(() => {
            // Check if at least one item is selected
            const selected = this.listEl.querySelectorAll(
              `input[data-checked="true"]`,
            );

            // Case true, enable unban button
            if (selected.length > 0) {
              this.unbanBtn.removeAttribute("disabled");
            }

            // Case false, disable unban button
            if (selected.length === 0) {
              this.unbanBtn.setAttribute("disabled", "");
            }
          }, 100);
        }
      } catch (err) {}
    });
    // unban button
    this.unbanForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.unbanBtn.hasAttribute("disabled")) return;
      // Get all selected items
      const selected = this.listEl.querySelectorAll(
        `input[data-checked="true"]`,
      );
      const getDatas = [];
      selected.forEach((el) => {
        const data = el
          .closest(`li[data-${this.prefix}-list-item]`)
          .getAttribute(`data-${this.prefix}-list-item`);
        getDatas.push(data);
      });
      this.unbanInp.value = JSON.stringify(getDatas);
      this.unbanInp.setAttribute("value", JSON.stringify(getDatas));
      this.unbanForm.submit();
    });
  }
}

class AddBanModal {
  constructor() {
    //modal elements
    this.modal = document.querySelector("[data-bans-modal]");
    this.openBtn = document.querySelector("button[data-add-ban]");
    this.addBanInp = document.querySelector("input[data-ban-add-inp]");
    this.addFieldBtn = document.querySelector("button[data-ban-add-new]");
    this.listEl = document.querySelector(`[data-bans-add-ban-list]`);
    this.submitBtn = document.querySelector(`button[data-bans-modal-submit]`);
    this.removeAllFieldBtn = document.querySelector(
      "button[data-add-ban-delete-all-item]",
    );
    this.formEl = document.querySelector("form[data-ban-add-form]");
    this.itemCount = 0;
    this.setDatepicker("0"); // for default field
    this.init();
  }

  init() {
    // delete item
    this.modal.addEventListener("click", (e) => {
      try {
        if (e.target.hasAttribute("data-add-ban-delete-item")) {
          e.target.closest("li").remove();
          this.updateActionBtns();
        }
      } catch (e) {}

      try {
        if (e.target.hasAttribute("data-add-ban-delete-all-item")) {
          this.listEl.querySelectorAll("li").forEach((item) => {
            item.remove();
          });
        }
      } catch (e) {}

      try {
        if (e.target.closest("button").hasAttribute("data-bans-modal-close")) {
          this.closeModal();
        }
      } catch (e) {}

      this.updateActionBtns();
    });

    //open modal
    this.openBtn.addEventListener("click", (e) => {
      this.openModal();
    });

    // add field
    this.addFieldBtn.addEventListener("click", (e) => {
      this.addItem();
      this.updateActionBtns();
    });

    // Check that all inputs have a value to submit
    this.listEl.addEventListener("input", (e) => {
      this.checkInpValidity();
    });

    this.listEl.addEventListener("change", (e) => {
      this.checkInpValidity();
    });

    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      // prepare data
      const data = [];
      this.listEl.querySelectorAll("li").forEach((item) => {
        const ip = item.querySelector("input[data-bans-add-ip]").value;
        const banEnd = item
          .querySelector("input[data-bans-add-ban-end]")
          .getAttribute("data-timestamp");
        data.push({
          ip: ip,
          ban_end: +banEnd,
          ban_start: +Date.now().toString().substring(0, 10),
          reason: "ui",
        });
      });
      this.addBanInp.setAttribute("value", JSON.stringify(data));
      this.addBanInp.value = JSON.stringify(data);
      this.formEl.submit();
    });
  }

  openModal() {
    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
  }

  closeModal() {
    this.modal.classList.add("hidden");
    this.modal.classList.remove("flex");
  }

  checkInpValidity() {
    const inps = this.listEl.querySelectorAll("input");
    let isAllValid = true;
    for (let i = 0; i < inps.length; i++) {
      const inpEl = inps[i];
      if (!inpEl.checkValidity() || !inpEl.value) {
        isAllValid = false;
        break;
      }
    }

    isAllValid
      ? this.submitBtn.removeAttribute("disabled")
      : this.submitBtn.setAttribute("disabled", "");
  }

  // Check if items and update button disabled/enabled states
  updateActionBtns() {
    const items = this.listEl.querySelectorAll("li");
    const itemsCount = items.length;

    itemsCount
      ? this.removeAllFieldBtn.removeAttribute("disabled")
      : this.removeAllFieldBtn.setAttribute("disabled", "");

    itemsCount ? null : this.submitBtn.setAttribute("disabled", "");
  }

  addItem() {
    // add item
    this.itemCount++;
    let item = `<li
    data-bans-add-ban-list
    class="items-center grid grid-cols-12 border-b border-gray-300 py-2.5"
  >
    <div class="mx-1.5 col-span-5">
      <label for="ip-${this.itemCount}" class="sr-only">ip</label>
      <input
        data-bans-add-ip
        type="text"
        id="ip-${this.itemCount}"
        name="ip-${this.itemCount}"
        class="dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 disabled:opacity-75 focus:valid:border-green-500 focus:invalid:border-red-500 outline-none focus:border-primary text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1 font-normal text-gray-700 transition-all placeholder:text-gray-500"
        placeholder="127.0.0.1"
        pattern="((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])))$"
        required
      />
    </div>
    <div class="mx-1.5 col-span-5">
      <label for="ban-end-ban-end-${this.itemCount}" class="sr-only">Ban end</label>
      <div class="relative">
        <input
          data-bans-add-ban-end
          type="text"
          id="ban-end-${this.itemCount}"
          name="ban-end-${this.itemCount}"
          class="dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 disabled:opacity-75 focus:valid:border-green-500 focus:invalid:border-red-500 outline-none focus:border-primary text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1 font-normal text-gray-700 transition-all placeholder:text-gray-500"
          placeholder="01/01/2021 00:00:00"
          pattern="(.*?)"
          required
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="pointer-events-none absolute top-1 right-2 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      </div>
    </div>
    <div class="mx-1.5 col-span-2 flex justify-center items-center">
      <button
        data-add-ban-delete-item
        type="button"
        class="dark:bg-red-500/90 duration-300 dark:opacity-90 flex justify-center items-center p-2 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-red-500 hover:bg-red-500/80 focus:bg-red-500/80 leading-normal text-base ease-in tracking-tight-rem shadow-xs bg-150 bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 pointer-events-none"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  </li>`;
    let cleanHTML = DOMPurify.sanitize(item);
    this.listEl.insertAdjacentHTML("beforeend", cleanHTML);
    this.setDatepicker(this.itemCount);
  }

  setDatepicker(id) {
    // instantiate datepicker
    const dateOptions = {
      locale: "en",
      dateFormat: "m/d/Y H:i:S",
      defaultDate: Date.now() + 3600000 * 24,
      enableTime: true,
      enableSeconds: true,
      time_24hr: true,
      minuteIncrement: 1,
      onChange(selectedDates, dateStr, instance) {
        const inpEl = document.querySelector(`input#ban-end-${id}`);

        // Get date to timestamp
        const pickStamp = +Date.parse(new Date(dateStr).toString());
        const nowStamp = +Date.now();

        // Case pick is before current date
        if (pickStamp < nowStamp) {
          inpEl.setAttribute("data-timestamp", Date.now() + 3600000 * 24);
          return instance.setDate(nowStamp);
        }

        // Case right value
        // Set timestamp in seconds in the related input
        const convertToS = +pickStamp.toString().substring(0, 10);

        inpEl.setAttribute("data-timestamp", convertToS);
      },
    };

    flatpickr(`input#ban-end-${id}`, dateOptions);
  }
}

const setDropdown = new Dropdown();
const setFilter = new Filter();
const setUnban = new Unban();
const setModal = new AddBanModal();
