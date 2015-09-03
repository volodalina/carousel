var Slider = function() {
    this.bindContexts();
};

Slider.prototype = {

    offset: 548,

    configs: [
        {
            "text": "Просмотр 1",
            "id": 1
        },
        {
            "text": "Просмотр 2",
            "id": 2
        },
        {
            "text": "Просмотр 3",
            "id": 3
        },
        {
            "text": "Просмотр 4",
            "id": 4
        },
        {
            "text": "Просмотр 5",
            "id": 5
        },
        {
            "text": "Просмотр 6",
            "id": 6
        },
        {
            "text": "Просмотр 7",
            "id": 7
        },
        {
            "text": "Просмотр 8",
            "id": 8
        },
        {
            "text": "Просмотр 9",
            "id": 9
        },
        {
            "text": "Просмотр 10",
            "id": 10
        }
    ],

    addEventListeners: function() {
        this.flipped.addEventListener('click', this.bindedOnClickView, false);
        this.outerListView.addEventListener('mouseenter', this.bindedOnMouseEnter, false);
        this.outerListView.addEventListener('mouseleave', this.bindedOnMouseleave, false);
        this.outerListPreview.addEventListener('click', this.bindedOnClickPreview, false);
        this.outerListPreview.addEventListener('mouseenter', this.bindedOnMouseEnter, false);
        this.outerListPreview.addEventListener('mouseleave', this.bindedOnMouseleave, false);
    },

    bindContexts: function() {
        this.bindedOnClickView = this.onClickView.bind(this);
        this.bindedOnMouseEnter = this.onMouseenter.bind(this);
        this.bindedOnMouseleave = this.onMouseleave.bind(this);
        this.bindedSlideShow = this.slideShow.bind(this);
        this.bindedOnClickPreview = this.onClickPreview.bind(this);
    },

    initialization: function() {
        var _this = this;
        var contentView = document.querySelector('template[id="view"]').content;
        var contentPreView = document.querySelector('template[id="preview"]').content;

        var spanView = contentView.querySelector('span');
        var outerView = contentView.querySelector('.outer');
        _this.listView = document.querySelector('[data-role="list-view"]');
        var fragmentView = document.createDocumentFragment();

        _this.listPreview = document.querySelector('[data-role="list-preview"]');
        var outerPreview = contentPreView.querySelector('.outer');
        var spanPreview = contentPreView.querySelector('span');
        var fragmentPreview = document.createDocumentFragment();

        _this.configs.forEach(function(_config) {
            spanView.innerHTML = _config.text;
            outerView.dataset.id = _config.id;
            spanPreview.innerHTML = _config.text;
            outerPreview.dataset.id = _config.id;
            if (_config.id === 1) {
                _this.currentSlideId = 1;
                outerPreview.classList.add('active');
            } else {
                outerPreview.classList.remove('active');
            }
            fragmentView.appendChild(contentView.cloneNode(true));
            fragmentPreview.appendChild(contentPreView.cloneNode(true));
        });
        _this.listView.appendChild(fragmentView);
        _this.listPreview.appendChild(fragmentPreview);

        _this.viewSliders = Array.prototype.slice.call(_this.listView.querySelectorAll('[data-role="view-slider"]'));
        _this.previewSliders = Array.prototype.slice.call(_this.listPreview.querySelectorAll('[data-role="preview-slider"]'));
        _this.flipped = document.querySelector('[data-role="flipped"]');
        _this.outerListPreview = document.querySelector('[data-role="outer-list-preview"]');
        _this.outerListView = document.querySelector('[data-role="outer-list-view"]');

        _this.setCurrentSlider();
        _this.runSlideShow();
    },

    onMouseenter: function() {
        this.stopSlideShow();
    },

    onMouseleave: function() {
        this.runSlideShow();
    },

    runSlideShow: function() {
        var _this = this;
        if (!_this.slideShowIntervalId) {
            _this.slideShowIntervalId = window.setInterval(_this.bindedSlideShow, 3000);
        }
    },

    stopSlideShow: function() {
        var _this = this;
        if (_this.slideShowIntervalId) {
            window.clearInterval(_this.slideShowIntervalId);
            _this.slideShowIntervalId = null;
        }
    },

    setCurrentSlider: function(manualMode) {
        var _this = this;
        _this.viewSliders.forEach(function(slider) {
            var id = parseInt(slider.dataset.id);
            if (id === _this.currentSlideId) {
                _this.listView.style.left = -(id - 1) * _this.offset + 'px';
            }
        });
        _this.previewSliders.forEach(function(slider) {
            var id = parseInt(slider.dataset.id);
            if (id === _this.currentSlideId) {
                slider.classList.add('active');
                if (_this.currentSlideId === 6) {
                    _this.listPreview.style.left = -_this.offset + 'px';
                }
                if (_this.currentSlideId === 5 || _this.currentSlideId === 1) {
                    _this.listPreview.style.left = '0px';
                }
            } else {
                slider.classList.remove('active');
            }
        });
        if (manualMode) {
            _this.runSlideShow();
        }
    },

    onClickView: function(event) {
        if (event && event.target) {
            var arrow = this.getDataParameter(event.target, 'action');
            if (arrow) {
                this.stopSlideShow();
                if (arrow.dataset.action === 'previous') {
                    if (this.currentSlideId > 1) {
                        this.currentSlideId -= 1;
                    }
                } else if (arrow.dataset.action === 'next') {
                    if (this.currentSlideId < 10) {
                        this.currentSlideId += 1;
                    }
                }
                this.setCurrentSlider(true);
            }
        }
    },

    onClickPreview: function(event) {
        if (event && event.target) {
            var previewSlider = this.getDataParameter(event.target, 'role');
            if (previewSlider) {
                this.stopSlideShow(true);
                if (previewSlider.dataset.id) {
                    this.currentSlideId = parseInt(previewSlider.dataset.id);
                    this.setCurrentSlider();
                }
            }
        }
    },

    slideShow: function() {
        if (this.currentSlideId === 10) {
            this.currentSlideId = 1;
        } else {
            this.currentSlideId += 1;
        }
        this.setCurrentSlider();
    },

    getDataParameter: function(element, param, _n) {
        if (!element) {
            return null;
        }

        var n = !( _n === undefined || _n === null ) ? _n : 5;
        if (n > 0) {
            if (!element.dataset || !element.dataset[param]) {
                return this.getDataParameter(element.parentNode, param, n - 1);
            } else if (element.dataset[param]) {
                return element;
            }
        }
        return null;
    }
};

window.onload = function() {
    var slider = new Slider();
    slider.initialization();
    slider.addEventListeners();
};