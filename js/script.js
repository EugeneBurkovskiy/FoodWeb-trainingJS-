"use strict";

document.addEventListener('DOMContentLoaded', () => {
    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //timer

    const deadline = '2022-09-21';
    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);

    //modal
    //my solution
    // const modal = document.querySelector(".modal"),
    //     button1 = document.querySelector(".btn.btn_white"),
    //     button2 = document.querySelector(".btn.btn_dark"),
    //     close = document.querySelector(".modal__close");
    // console.log(button1);

    // const btns = [button1, button2];
    // function displayModal(btn) {
    //     btn.addEventListener('click', () => {
    //         modal.style.display = "block";
    //     });
    //     close.addEventListener('click', () => {
    //         modal.style.display = "none";
    //     });
    //     modal.classList.add("fade");
    // }
    // btns.forEach(item => displayModal(item));

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show', 'fade', 'fade_1s');
        modal.classList.remove('hide');
        document.body.style.overflow = "hidden";
        clearInterval(modalTimerId);
    }
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal();
        });
    });
    function closeModal() {
        modal.classList.add('hide', 'fade', 'fade_1s');
        modal.classList.remove('show');
        document.body.style.overflow = "";
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000000000000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //Classes for cards
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes || "menu__item";
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUah();
        }
        changeToUah(price) {
            this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes = 'menu__item';  //на случай если пользователь не ввел menu__item
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `

                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>

            `;

            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url},status: ${res.status}`);
        }
        return await res.json();
    };

    getResource("http://localhost:3000/menu")
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });

    // getResource("http://localhost:3000/menu")
    //     .then(data => createCard(data));


    // function createCard(data) {
    //     data.forEach(({ img, altimg, title, descr, price }) => {
    //         const element = document.createElement("div");

    //         element.classList.add('menu__item');
    //         element.innerHTML = `

    //         <img src=${img} alt=${altimg}>
    //         <h3 class="menu__item-subtitle">${title}</h3>
    //         <div class="menu__item-descr">${descr}</div>
    //         <div class="menu__item-divider"></div>
    //         <div class="menu__item-price">
    //             <div class="menu__item-cost">Цена:</div>
    //             <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //         </div>

    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }


    //forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/spinner/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=utf-8"
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display:block;
                margin: 0 auto;
            `;
            form.append(statusMessage);

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    //Slider first method

    // const slides = document.querySelectorAll('.offer__slide'),
    //     prev = document.querySelector('.offer__slider-prev'),
    //     next = document.querySelector('.offer__slider-next'),
    //     total = document.querySelector('#total'),
    //     current = document.querySelector('#current');
    // let slideIndex = 1;

    // showSlides(slideIndex);

    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }
    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach((item) => item.classList.add("hide", "fade"));

    //     slides[slideIndex - 1].classList.remove("hide", "fade");
    //     slides[slideIndex - 1].classList.add("show", "fade");


    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlides(n) {
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', function () {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', function () {
    //     plusSlides(1);
    // });

    // const slides = document.querySelectorAll('.offer__slide'),
    //     prev = document.querySelector('.offer__slider-prev'),
    //     next = document.querySelector('.offer__slider-next'),
    //     total = document.querySelector('#total'),
    //     current = document.querySelector('#current'),
    //     slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    //     slidesField = document.querySelector(".offer__slider-inner"),
    //     width = window.getComputedStyle(slidesWrapper).width;


    //my solution for navigation for the second method
    // // navigation for slides
    // const slider = document.querySelector(".offer__slider"),
    //     indicators = document.createElement("div");

    // indicators.classList.add("carousel-indicators");
    // slider.style.position = "relative";
    // slider.append(indicators);

    // const dot = document.createElement("div");
    // dot.classList.add("dot");

    // slides.forEach(item => {
    //     const dot = document.createElement("div");
    //     dot.classList.add("dot");
    //     indicators.append(dot);
    // });

    // const dots = Array.from(document.querySelectorAll(".dot"));

    // let slideIndex = 1;
    // let offset = 0;


    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    //     current.textContent = `0${slideIndex}`;
    // } else {
    //     total.textContent = slides.length;
    //     current.textContent = slideIndex;
    // }

    // slidesField.style.width = 100 * slides.length + '%';
    // slidesField.style.display = 'flex';
    // slidesField.style.transition = '0.5s all';
    // slidesWrapper.style.overflow = 'hidden';
    // slides.forEach(slide => {
    //     slide.style.width = width;
    // });
    // dots[0].style.transform = "scale(1.2)";
    // dots[0].style.background = "#54ed39";

    // next.addEventListener('click', () => {
    //     if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
    //         offset = 0;
    //     } else {
    //         offset += +width.slice(0, width.length - 2);
    //     }
    //     slidesField.style.transform = `translateX(-${offset}px)`;
    //     dots.forEach(item => {
    //         item.style.transform = "";
    //         item.style.background = "";
    //     });
    //     if (slideIndex == slides.length) {
    //         slideIndex = 1;
    //         dots[slideIndex - 1].style.transform = "scale(1.2)";
    //         dots[slideIndex - 1].style.background = "#54ed39";
    //     } else {
    //         slideIndex++;
    //         dots[slideIndex - 1].style.transform = "scale(1.2)";
    //         dots[slideIndex - 1].style.background = "#54ed39";
    //     }

    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // });

    // prev.addEventListener('click', () => {
    //     if (offset == 0) {
    //         offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    //     } else {
    //         offset -= +width.slice(0, width.length - 2);
    //     }
    //     slidesField.style.transform = `translateX(-${offset}px)`;
    //     dots.forEach(item => {
    //         item.style.transform = "";
    //         item.style.background = "";
    //     });
    //     if (slideIndex == 1) {
    //         slideIndex = slides.length;
    //         dots[slides.length - 1].style.transform = "scale(1.2)";
    //         dots[slides.length - 1].style.background = "#54ed39";
    //     } else {
    //         slideIndex--;
    //         dots[slideIndex].style.transform = "";
    //         dots[slideIndex].style.background = "";
    //     }

    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // });

    // indicators.addEventListener("click", (e) => {
    //     for (let i = 0; i < dots.length; i++) {
    //         if (e.target == dots[i]) {
    //             slideIndex = i + 1;
    //             dots.forEach(item => {
    //                 item.style.transform = "";
    //                 item.style.background = "";
    //             });
    //             if (e.target == dots[0]) {
    //                 offset = 0;
    //                 dots[i].style.transform = "scale(1.2)";
    //                 dots[i].style.background = "#54ed39";
    //             } else {
    //                 offset = +width.slice(0, width.length - 2) * i;
    //                 dots[i].style.transform = "scale(1.2)";
    //                 dots[i].style.background = "#54ed39";
    //             }
    //             slidesField.style.transform = `translateX(-${offset}px)`;
    //             if (slides.length < 10) {
    //                 current.textContent = `0${slideIndex}`;
    //             } else {
    //                 current.textContent = slideIndex;
    //             }
    //         }
    //     }
    // });

    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        slider = document.querySelector(".offer__slider"),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector(".offer__slider-wrapper"),
        slidesField = document.querySelector(".offer__slider-inner"),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = "relative";

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute("data-slide-to", i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
        dots.forEach(dot => dot.style.opacity = ".5");
        dots[slideIndex - 1].style.opacity = 1;
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
        dots.forEach(dot => dot.style.opacity = ".5");
        dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            const slideTo = e.target.getAttribute("data-slide-to");

            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = ".5");
            dots[slideIndex - 1].style.opacity = 1;
        });
    });

});