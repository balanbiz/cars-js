"use strict";
window.onload = () => {
    function testWebP(callback) {
        var webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function (support) {
        if (support == true) {
            document.querySelector("body").classList.add("webp");
        } else {
            document.querySelector("body").classList.add("no-webp");
        }
    });

    // Phone mask

    function setCursorPosition(pos, elem) {
        elem.focus();
        elem.selectionStart = elem.value.length;

        if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
        else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd("character", pos);
            range.moveStart("character", pos);
            range.select();
        }
    }

    function mask(event) {
        var matrix = "+7 (___) ___-__-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, "");
        if (def.length >= val.length) val = def;
        this.value = matrix.replace(/./g, function (a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
        });
        if (event.type == "blur") {
            if (this.value.length == 2) this.value = "";
        } else setCursorPosition(this.value.length, this);
    }
    if (document.querySelectorAll("._phone")) {
        let phoneInput = document.querySelectorAll("._phone");
        phoneInput.forEach(item => {
            item.addEventListener("input", mask, false);
            item.addEventListener("focus", mask, false);
            item.addEventListener("blur", mask, false);
        });
    }

    // Forms
    // constructing forms
    class Form {
        constructor({ wrapper = null } = {}) {
            this.wrapper = document.getElementById(wrapper);
            (this.form = this.wrapper.querySelector(".#")),
                (this.button_fake = this.wrapper.querySelector(".#")),
                (this.button_real = this.wrapper.querySelector(".#")),
                (this.messageDiv = this.form.querySelector(".#")),
                (this.messages = {
                    loading: "Подождите, идет отправка данных...",
                    success: "Спасибо! Скоро мы с вами свяжемся.",
                    failure: "Ошибка отправки, пожалуйста, сообщите нам!",
                    empty: "Пожалуйста, заполните обязательные поля.",
                    phone: "Неправильно набран номер",
                }),
                (this.formReq = this.form.querySelectorAll("._req")),
                (this.error = 0);
        }

        formValidateListen() {
            this.button_fake.addEventListener("click", e => {
                e.preventDefault();
                this.formValidate();
                grecaptcha.ready(function () {
                    grecaptcha.execute("6LfVXjasdasdasdBSl1_AELtasdasdasdasd745e4Pk", { action: "submit" }).then(function (token) {});
                });
                this.formSending();
            });
        }

        async formSending() {
            if (this.error === 0) {
                this.form.classList.add("_sending");
                this.messageControl("loading");
                let formData = new FormData(this.form);
                let response = await fetch("sendmail.php", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    this.messageControl("success");
                    this.form.reset();
                    this.form.classList.remove("_sending");
                    this.showModal();
                    this.button_fake.nextElementSibling.removeAttribute("disabled");
                    this.trueSubmit();
                } else {
                    this.messageControl("failure");
                    this.form.classList.remove("_sending");
                }
            }
        }

        trueSubmit() {
            this.form.addEventListener("submit", e => {
                e.preventDefault();
            });
            this.button_real.click();
        }

        formValidate() {
            for (let index = 0; index < this.formReq.length; index++) {
                const input = this.formReq[index];
                this.error = 0;
                this.formRemoveError(input);

                if (input.classList.contains("_phone")) {
                    if (!this.phoneTest(input)) {
                        this.formAddError(input);
                        this.messageControl("phone");
                        this.error++;
                    } else {
                        if (input.value === "") {
                            this.formAddError(input);
                            this.messageControl("phone");
                            this.error++;
                        }
                    }
                }
            }
        }

        messageControl(MessageStatus) {
            const messagesArray = Object.entries(this.messages);
            for (let i = 0; i < messagesArray.length; i++) {
                const messagesArrItem = messagesArray[i];
                if (messagesArrItem[0] === MessageStatus) {
                    this.messageDiv.textContent = messagesArrItem[1];
                }
            }
        }

        formAddError(input) {
            input.parentElement.classList.add("_error");
            input.classList.add("_error");
        }

        formRemoveError(input) {
            input.parentElement.classList.remove("_error");
            input.classList.remove("_error");
        }

        showModal() {
            const modalWindow = document.querySelector(".formmm");
            modalWindow.style.display = "block";
            document.querySelector(".form-modal__close").addEventListener("click", () => {
                modalWindow.style.display = "none";
            });
        }

        phoneTest(input) {
            let regular = /(\+7|8)[- _]*\(?[- _]*(\d{3}[- _]*\)?([- _]*\d){7}|\d\d[- _]*\d\d[- _]*\)?([- _]*\d){6})/g;
            return regular.test(input.value);
        }

        addMetrikaCounter(name, value) {
            this.form.setAttribute(name, value);
        }

        init() {
            this.formValidateListen();
        }
    }

    // Creating first form
    try {
        const smallForm = new Form({
            wrapper: "form",
        });
        smallForm.init();
        smallForm.addMetrikaCounter("onsubmit", "ym(1111111,'reachGoal','first-form')");
    } catch (error) {}

    // Header

    const headerElement = document.querySelector(".header");

    function stickHeader() {
        if (document.documentElement.scrollTop >= 84) {
            headerElement.classList.add("sticky");
        } else if (document.documentElement.scrollTop == 0) {
            headerElement.classList.remove("sticky");
        }
    }

    window.addEventListener("scroll", stickHeader, {
        passive: true,
    });

    // Burger
    let burgerIcon = document.querySelector(".nav");

    burgerIcon.addEventListener("click", () => {
        document.body.classList.toggle("nav-open");
    });

    // Burger menu

    const bigMenuFolders = document.querySelectorAll(".nav-list>.nav-item.fold-it");

    function activateBigMenu() {
        bigMenuFolders.forEach(folder => {
            folder.addEventListener("click", () => {
                if (window.screen.availWidth > 1250) {
                    for (let i = 0; i < bigMenuFolders.length; i++) {
                        const eachFolder = bigMenuFolders[i];
                        eachFolder.classList.remove("active");
                    }
                    folder.classList.toggle("active");
                } else {
                    folder.classList.toggle("active");
                }
            });
        });
    }

    activateBigMenu();

    // lazy loading module

    function initializeLazyLoad() {
        // Yandex map
        let mapYandex = document.createElement("iframe");
        mapYandex.setAttribute("data-src", "https://yandex.ru/map-widget/111111111");
        mapYandex.setAttribute("title", "Наши отзывы на яндекс картах");
        let mapYandexParentDiv = document.querySelector(".footer-map");
        mapYandexParentDiv.appendChild(mapYandex);

        // Images
        const lazyImages = document.querySelectorAll("img[data-src], source[data-srcset], .footer-map"),
            userWindowHeight = document.documentElement.clientHeight;

        // Process
        let lazyImagesPositions = [];

        if (lazyImages.length > 0) {
            lazyImages.forEach(img => {
                if (img.dataset.src || img.dataset.srcset) {
                    if (window.innerWidth > 768) {
                        lazyImagesPositions.push(img.getBoundingClientRect().top + document.documentElement.scrollTop - 3500);
                        lazyScrollCheck();
                    } else {
                        lazyImagesPositions.push(img.getBoundingClientRect().top + document.documentElement.scrollTop - 4500);
                        lazyScrollCheck();
                    }
                }
            });
            if (window.innerWidth > 768) {
                lazyImagesPositions.push(mapYandexParentDiv.getBoundingClientRect().top + document.documentElement.scrollTop - 6500);
            } else {
                lazyImagesPositions.push(mapYandexParentDiv.getBoundingClientRect().top + document.documentElement.scrollTop - 8500);
            }
        }

        function lazyScroll() {
            if (document.querySelectorAll("img[data-src], source[data-srcset], .footer-map").length > 0) {
                lazyScrollCheck();
            }
        }

        function lazyScrollCheck() {
            let imgIndex = lazyImagesPositions.findIndex(item => document.documentElement.scrollTop > item - userWindowHeight);
            if (imgIndex >= 0) {
                if (lazyImages[imgIndex].dataset.src) {
                    lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
                    lazyImages[imgIndex].removeAttribute("data-src");
                } else if (lazyImages[imgIndex].dataset.srcset) {
                    lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
                    lazyImages[imgIndex].removeAttribute("data-srcset");
                } else if (lazyImages[imgIndex].classList.contains("footer-map")) {
                    mapYandexParentDiv.firstChild.classList.add("yandex-map");
                    mapYandexParentDiv.firstChild.src = mapYandexParentDiv.firstChild.dataset.src;
                    mapYandexParentDiv.firstChild.removeAttribute("data-src");
                }

                delete lazyImagesPositions[imgIndex];
            }
        }

        window.addEventListener("scroll", lazyScroll, {
            passive: true,
        });
    }

    // Start lazy loading

    setTimeout(initializeLazyLoad, 300);

    // Create sliders

    class Slider {
        constructor({ wrap = null, prev = null, next = null, dots = null, timing = null, autoplay } = {}) {
            this.wrap = document.querySelector(wrap);
            this.slides = this.wrap.children;
            this.prev = document.querySelector(prev);
            this.next = document.querySelector(next);
            this.dots = document.querySelector(dots);
            this.autoplay = autoplay;
            this.slideWidth = this.slides[0].clientWidth;
            this.slideIndex = 1;
            this.position = 0;
            this.slidesOnScreen = null;
            this.downX = 0;
            this.upX = 0;
            this.interval = null;
            this.allChildsWidth = 0;
            this.timing = timing;
        }

        checkSlidesOnScreen = () => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                this.slidesOnScreen = 1;
            } else if (window.matchMedia("(min-width: 769px)").matches) {
                this.slidesOnScreen = 2;
            }
        };

        createDots = () => {
            for (let i = 0; i < this.slides.length; i += 2) {
                this.dots.appendChild(document.createElement("li"));
            }
            this.dots.children[0].classList.add("dot-active");
        };

        changeActiveDot = () => {
            if (this.slideIndex % this.slidesOnScreen != 0) {
                const allDots = this.dots.children;
                for (let i = 0; i < allDots.length; i++) {
                    allDots[i].classList.remove("dot-active");
                }
                allDots[Math.floor(this.slideIndex / this.slidesOnScreen)].classList.add("dot-active");
            }
        };

        bindTriggers = () => {
            this.next.addEventListener("click", e => {
                e.preventDefault();
                this.nextSlide();
                clearInterval(this.interval);
            });
            this.prev.addEventListener("click", e => {
                e.preventDefault();
                this.prevSlide();
                clearInterval(this.interval);
            });
        };

        bindDragging = () => {
            this.wrap.addEventListener("dragstart", e => {
                e.preventDefault();
            });

            this.wrap.addEventListener("mousedown", e => {
                this.downX = e.clientX;
            });
            this.wrap.addEventListener("touchstart", e => {
                this.downX = e.touches[0].clientX;
            });
            this.wrap.addEventListener(
                "mouseup",
                e => {
                    this.upX = e.clientX;
                    this.changeSlideIf();
                },
                { passive: true }
            );
            this.wrap.addEventListener(
                "touchend",
                e => {
                    this.upX = e.changedTouches[0].pageX;
                    this.changeSlideIf();
                },
                { passive: true }
            );
        };

        changeSlideIf = () => {
            if (this.downX - this.upX > 100) {
                this.nextSlide();
                clearInterval(this.interval);
            } else if (this.upX - this.downX > 100) {
                this.prevSlide();
                clearInterval(this.interval);
            }
        };

        nextSlide = () => {
            if (this.slideIndex > this.slides.length - this.slidesOnScreen) {
                this.slideIndex = 1;
                this.position = 0;
                this.wrap.style.transform = `translateX(${this.position + "px"})`;
                try {
                    this.changeActiveDot();
                } catch (error) {}
            } else {
                this.wrap.style.transform = `translateX(${this.position - this.slideWidth + "px"})`;
                (this.position -= this.slideWidth), (this.slideIndex += 1);
                try {
                    this.changeActiveDot();
                } catch (error) {}
            }
        };

        prevSlide = () => {
            if (this.slideIndex <= 1) {
                this.slideIndex = this.slides.length - this.slidesOnScreen + 1;
                this.position = -((this.slides.length - this.slidesOnScreen) * this.slideWidth);
                this.wrap.style.transform = `translateX(${this.position + "px"})`;
                this.changeActiveDot();
            } else {
                this.wrap.style.transform = `translateX(${this.position + this.slideWidth + "px"})`;
                (this.position += this.slideWidth), (this.slideIndex -= 1);
                this.changeActiveDot();
            }
        };

        watchResize = () => {
            window.addEventListener(
                "resize",
                () => {
                    this.slideWidth = this.slides[0].clientWidth;
                    this.checkSlidesOnScreen();
                    this.position = 0;
                    this.slideIndex = 1;
                    this.wrap.style.transform = `translateX(${this.position + "px"})`;
                },
                { passive: true }
            );
        };

        startAutoplay = time => {
            if (this.autoplay) {
                this.interval = setInterval(() => this.nextSlide(), time);
            }
        };

        render() {
            this.checkSlidesOnScreen();
            try {
                this.createDots();
                this.bindTriggers();
                this.bindDragging();
            } catch (error) {}
            this.startAutoplay(this.timing);
            this.watchResize();
        }

        tagsRun = () => {
            for (let i = 0; i < this.wrap.children.length; i++) {
                this.allChildsWidth += this.wrap.children[i].clientWidth - 5;
            }

            // this.wrap.style.transform = `translateX(-${this.allChildsWidth}px)`

            this.wrap.animate([{ transform: `translateX(0px)` }, { transform: `translateX(-${this.allChildsWidth}px)` }], {
                duration: 300000,
                iterations: Infinity,
            });
        };
    }

    // Init Sliders

    try {
        const sliderCars = new Slider({
            wrap: ".sample__list-inner",
            next: ".samples-next",
            prev: ".samples-prev",
            dots: ".samples-dots",
            autoplay: true,
            timing: 4500,
        });

        sliderCars.render();
    } catch (error) {
        try {
            document.querySelector(".samples-controls").style.display = "none";
            document.querySelector("#slider").style.display = "none";
        } catch (error) {}
    }

    try {
        const sliderTags = new Slider({
            wrap: ".tags-wrap",
        });

        sliderTags.tagsRun();
    } catch (error) {}

    // start the others form

    try {
        const smallForm2 = new Form({
            wrapper: "form2",
        });
        smallForm2.init();
        smallForm2.addMetrikaCounter("onsubmit", "ym(1111111,'reachGoal','second-form')");
    } catch (error) {}
    try {
        const smallForm3 = new Form({
            wrapper: "form3",
        });
        smallForm3.init();
        smallForm3.addMetrikaCounter("onsubmit", "ym(1111111,'reachGoal','third-form')");
    } catch (error) {}
    try {
        const smallForm4 = new Form({
            wrapper: "form4",
        });
        smallForm4.init();
        smallForm4.addMetrikaCounter("onsubmit", "ym(1111111,'reachGoal','fourth-form')");
    } catch (error) {}

    // Creating Accordion
    class Accordion {
        constructor({ wrapper = null } = {}) {
            (this.wrapper = document.querySelector(wrapper)), (this.titles = this.wrapper.querySelectorAll("[data-acc]"));
            this.titlesArr = Array.from(this.titles);
        }

        listenTitles() {
            this.titles.forEach(title => {
                const descr = title.nextElementSibling;
                this._slideUp(descr, 400);
                title.addEventListener(
                    "click",
                    e => {
                        e.target.classList.toggle("_active");
                        this._slideToggle(descr, 400);

                        let titlesArrActive = this.titlesArr.filter(item => item.classList.contains("_active"));

                        if (titlesArrActive.length >= 2) {
                            for (let i = 0; i < this.titles.length; i++) {
                                const title = this.titles[i];
                                title.classList.remove("_active");
                                this._slideUp(title.nextElementSibling, 400);
                            }
                            e.target.classList.toggle("_active");
                            this._slideToggle(descr, 400);
                        }
                    },
                    { passive: true }
                );
            });
        }

        _slideUp = (target, duration = 400) => {
            if (!target.classList.contains("_slide")) {
                target.classList.add("_slide");
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + "ms";
                target.style.height = target.offsetHeight + "px";
                target.offsetHeight;
                target.style.overflow = "hidden";
                target.style.height = 0;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                window.setTimeout(() => {
                    target.style.removeProperty("height");
                    target.style.removeProperty("padding-top");
                    target.style.removeProperty("padding-bottom");
                    target.style.removeProperty("margin-top");
                    target.style.removeProperty("margin-bottom");
                    target.style.removeProperty("overflow");
                    target.style.removeProperty("transition-duration");
                    target.style.removeProperty("transition-property");
                    target.classList.remove("_slide");
                    target.style.display = "none";
                }, duration);
            }
        };
        _slideDown = (target, duration = 400) => {
            if (!target.classList.contains("_slide")) {
                target.classList.add("_slide");
                target.style.display = "block";
                let height = target.offsetHeight;
                target.style.overflow = "hidden";
                target.style.height = 0;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                target.offsetHeight;
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + "ms";
                target.style.height = height + "px";
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                window.setTimeout(() => {
                    target.style.removeProperty("height");
                    target.style.removeProperty("overflow");
                    target.style.removeProperty("transition-duration");
                    target.style.removeProperty("transition-property");
                    target.classList.remove("_slide");
                }, duration);
            }
        };
        _slideToggle = (target, duration = 400) => {
            if (target.previousElementSibling.classList.contains("_active")) {
                return this._slideDown(target, duration);
            } else {
                return this._slideUp(target, duration);
            }
        };

        init() {
            this.listenTitles();
        }
    }

    try {
        const accordionFaq = new Accordion({ wrapper: ".faq-list[data-acc]" });
        accordionFaq.init();
    } catch (error) {}
    try {
        const accordionBigForm = new Accordion({ wrapper: ".accordion[data-acc]" });
        accordionBigForm.init();
    } catch (error) {}

    // Cookie popup
    let cookieBtn = document.querySelector("#cookie");
    if (cookieBtn) {
        if (localStorage.getItem("cookieStatus")) {
            cookieBtn.parentElement.style.display = "none";
        } else {
            cookieBtn.parentElement.style.display = "block";
            cookieBtn.addEventListener(
                "click",
                () => {
                    localStorage.setItem("cookieStatus", true);
                    cookieBtn.parentElement.style.display = "none";
                },
                { passive: true }
            );
        }
    }
};

// Auto Calculator

if (document.querySelector(".credit")) {
    const carPrice = document.getElementById("cash"),
        carPriceRange = document.getElementById("cash_range"),
        months = document.getElementById("time"),
        monthsRange = document.getElementById("time_range"),
        loanResualt = document.getElementById("outcome_cash"),
        monthsResualt = document.getElementById("outcome_time"),
        paymentResualt = document.getElementById("outcome_payment"),
        inputsRange = document.querySelectorAll(".input-range"),
        inputsManual = document.querySelectorAll(".input-manual");
    let interestRate = 3,
        loanRate = 0.8;

    function numberWithSpaces(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
    }

    function assignValue() {
        carPrice.value = numberWithSpaces(carPriceRange.value);
        months.value = monthsRange.value;
    }

    function assignManualValue() {
        carPriceRange.value = +carPrice.value.replace(/\s+/g, "");
        monthsRange.value = months.value;
    }

    function initInputs(inputsArray) {
        for (let input of inputsArray) {
            input.addEventListener("input", () => {
                if (inputsArray == inputsRange) {
                    assignValue();
                } else {
                    assignManualValue();
                }
                calculation(+carPrice.value.replace(/\s+/g, ""), loanRate, months.value);
            });
        }
    }

    function inputValueError(validValue, input, inputMinNum, inputMaxNum) {
        if (isNaN(validValue) || validValue < inputMinNum || validValue > inputMaxNum || validValue == Infinity) {
            input.style.borderBottom = "2px solid red";
        } else {
            input.style.borderBottom = "1px dotted #35c855";
        }
    }

    function calculation(carPriceArg = 120000, loanRate = 0.8, monthsArg = 2) {
        inputValueError(carPriceArg, carPrice, 120000, 15000000), inputValueError(monthsArg, months, 2, 36);

        let loanAmount = carPriceArg * loanRate;
        let monthlyPayment = (loanAmount + (loanAmount / 100) * interestRate * monthsArg) / monthsArg;

        const loanAmountArounded = Math.round(loanAmount);
        const monthlyPaymentArounded = Math.round(monthlyPayment);
        if (monthlyPaymentArounded < 0) {
            return false;
        } else {
            loanResualt.innerHTML = `${numberWithSpaces(loanAmountArounded)}`;
            monthsResualt.innerHTML = `${interestRate}`;
            paymentResualt.innerHTML = `${numberWithSpaces(monthlyPaymentArounded)}`;
        }
    }

    assignValue(), initInputs(inputsRange), initInputs(inputsManual);
}
