window.createFloatingTooltip = (options) => {
    /** Detect mobile */
    let mobileAndTabletCheck = () => {
        let check = false;
        ((a) => { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        window.device = {
            iPad: /iPad/.test(navigator.userAgent),
            iPhone: /iPhone/.test(navigator.userAgent),
            Android4: /Android 4/.test(navigator.userAgent)
        }
        if (!check) { // mode desktop
            // desktop en mode responsive
            check = ((window.innerWidth <= 768) && (window.innerHeight <= 1024));
        }
        return check;
    };

    let FloatingTooltips = {
        modal_elem: document.createElement('div'),
        isMobile: mobileAndTabletCheck(),
        stylesheet: document.createElement('style'),
        tooltips: [],
        /** Show all tooltips */
        show: () => {
            let tooltip_count = 0;
            FloatingTooltips.tooltips.forEach(tooltip => {
                if (tooltip) {
                    tooltip_count += 1;
                    // tooltip.element.style.display = null;
                    tooltip.show();
                    tooltip._update();
                }
            });
            if (tooltip_count > 0) {
                FloatingTooltips.modal_elem.style.display = null;
            }
        },
        /** Hide all tooltips */
        hide: () => {
            FloatingTooltips.tooltips.forEach(tooltip => {
                if (tooltip) {
                    // tooltip.element.style.display = 'none';
                    tooltip.hide();
                    tooltip._update();
                }
            });
            FloatingTooltips.modal_elem.style.display = 'none';
        },
        /** Delete all elements*/
        delete: () => {
            FloatingTooltips.tooltips.forEach(tooltip => {
                if (tooltip) {
                    tooltip.delete();
                }
            });
            if (FloatingTooltips.modal_elem) {
                FloatingTooltips.modal_elem.remove();
                FloatingTooltips.modal_elem = null;
            }
            if (FloatingTooltips.stylesheet) {
                FloatingTooltips.stylesheet.remove();
                FloatingTooltips.stylesheet = null;
            }
            FloatingTooltips.tooltips = [];
        },
        /** Automatic tooltips opening */
        _autoshow: () => {
            if (options.autoshow === true) {
                if (typeof options.autoshow_period == 'number') { // Show tooltips after a time period
                    if (options.autoshow_identifier && options.autoshow_identifier.length > 1) { // Cookie identifier
                        let cookie = FloatingTooltips._getCookie(`FloatingTooltip-${options.autoshow_identifier}`);
                        if (cookie !== 'suspend') { // Not suspended
                            FloatingTooltips.show();
                        }
                    } else {
                        console.warn('Invalid option autoshow_identifier');
                    }
                } else {
                    FloatingTooltips.show(); // Show all tooltips after init
                }
            }
        },
        /** Automatic tooltips autoshow suspend */
        _suspendAutoshow: () => {
            if (options.autoshow === true) {
                if (typeof options.autoshow_period == 'number') { // Show tooltips after a time period
                    if (options.autoshow_identifier && options.autoshow_identifier.length > 1) { // Cookie identifier
                        FloatingTooltips._setCookie(`FloatingTooltip-${options.autoshow_identifier}`, 'suspend', options.autoshow_period); // Report next automatic show
                    } else {
                        console.warn('Invalid option autoshow_identifier');
                    }
                }
            }
        },
        _setCookie: (name, value, seconds) => {
            let expires = "";
            if (seconds) {
                let date = new Date();
                date.setTime(date.getTime() + (seconds * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        },
        _getCookie: (name) => {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
    };


    // Styles creation
    const style_base = `.floating-tooltip{position:absolute;width:max-content;top:0;left:0}.floating-modal{position:absolute;top:0;left:0;z-index:10000;height:100%;width:100%;background-color:#000;opacity:.5}.floating-shadow{box-shadow:0 0 10px 0 #444}`;
    const style_tooltip = `.floating-style{z-index:10002;background:#FFF;color:#000;font-weight:bold;padding:5px;border-radius:4px;font-size:90%;font-family:sans-serif;outline-style:solid;outline-width:1px;outline-color:rgb(0 0 0 / 25%);}.floating-arrow{position:absolute;z-index:10001;background:#FFF;width:8px;height:8px;transform:rotate(45deg);outline-style:solid;outline-offset:-1px;outline-width:1px;outline-color:rgb(0 0 0 / 25%);}.floating-shadow{box-shadow:0 0 10px 0 #444}`;
    const style_transparent = `.floating-style{z-index:10002;color:#FFF;background-color:rgb(0 0 0 / 25%);font-weight:bold;padding:10px;border-radius:4px;font-size:90%;font-family:sans-serif;outline-style:solid;outline-width:2px;outline-color:#FFF;outline-offset:-2px}.floating-arrow{position:absolute;z-index:10001;width:8px;height:8px;transform:rotate(45deg);outline-style:solid;outline-width:2px;outline-color:#FFF;outline-offset:-2px}.floating-shadow{box-shadow:0 0 10px 0 #444}`;
    FloatingTooltips.stylesheet.innerHTML += style_base;
    if (options.style) { // Option style définit
        switch (options.style) {
            case 'default':
                FloatingTooltips.stylesheet.innerHTML += style_tooltip;
                break;
            case 'transparent':
                FloatingTooltips.stylesheet.innerHTML += style_transparent;
                break;
            default:
                FloatingTooltips.stylesheet.innerHTML += style_tooltip;
                break;
        }
    } else { // Options style non définit
        FloatingTooltips.stylesheet.innerHTML += style_tooltip;
    }
    document.head.appendChild(FloatingTooltips.stylesheet);


    // Modal creation
    FloatingTooltips.modal_elem.classList.add('floating-modal');
    if (options.modal === false) { // On ne veut pas de modal
        FloatingTooltips.modal_elem.style.opacity = 0; // transparent
    } else if (typeof options.modal_opacity == 'number') { // modal_opacity definit et est un nombre
        FloatingTooltips.modal_elem.style.opacity = options.modal_opacity;
    }
    FloatingTooltips.modal_elem.style.display = 'none';
    FloatingTooltips.modal_elem.addEventListener('click', (e) => {
        FloatingTooltips.hide();
        FloatingTooltips._suspendAutoshow();
    });
    document.body.appendChild(FloatingTooltips.modal_elem);


    // Tooltips creation
    options.tooltips.forEach(tooltip_option => { // Pour chaques options

        // Tooltip
        let tooltip = {
            element: document.createElement('div'),
            reference: document.querySelector(tooltip_option.reference) || null,
            content: tooltip_option.content || '',
            placement: tooltip_option.placement || null,
            device: tooltip_option.device || null,
            arrow: (typeof tooltip_option.arrow == 'boolean') ? tooltip_option.arrow : FloatingTooltips.arrow,
            shadow: (typeof tooltip_option.shadow == 'boolean') ? tooltip_option.shadow : FloatingTooltips.shadow,
            hover: (typeof tooltip_option.hover == 'boolean') ? tooltip_option.hover : FloatingTooltips.hover,
        }
        let tooltip_classlist = ['floating-tooltip', 'floating-style'];
        if (options.shadow === true) {
            tooltip_classlist.push('floating-shadow');
        }
        DOMTokenList.prototype.add.apply(tooltip.element.classList, tooltip_classlist); // Class du tooltip
        tooltip.element.style.display = 'none';
        let tooltip_content = document.createElement('div');
        tooltip_content.classList.add('floating-content');
        tooltip_content.innerHTML = tooltip.content;
        tooltip.element.appendChild(tooltip_content);
        document.body.appendChild(tooltip.element); // Ajoute le tooltip à la page
        FloatingTooltips.tooltips.push(tooltip);

        // Arrow
        let arrow_elem = null;
        if (options.arrow === true) {
            arrow_elem = document.createElement('div');
            arrow_elem.classList.add('floating-arrow');
            tooltip.element.appendChild(arrow_elem);
        }

        // Middleware options
        const flip_options = {
            mainAxis: true,
            crossAxis: true,
            fallbackAxisSideDirection: 'none', // 'none' | 'start' | 'end';
            fallbackStrategy: 'bestFit', // 'bestFit' | 'initialPlacement';
        };
        const shift_options = {
            // padding: 5,
            limiter: window.FloatingUIDOM.limitShift({
                mainAxis: false,
            }),
        };
        const size_options = {
            apply({ availableWidth, availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                    maxWidth: `${availableWidth}px`,
                    maxHeight: `${availableHeight}px`,
                });
            },
        };
        const arrow_options = {
            element: arrow_elem,
            padding: 5, // Evite d'aller trop près des coins pour le border-radius
        }
        const autoPlacement_options = {
            autoAlignment: true,
        }

        /** Create/Update the tooltip position */
        tooltip._update = () => {
            if (!tooltip._canShow) { return false; }
            // Placement https://floating-ui.com/docs/tutorial
            window.FloatingUIDOM.computePosition(tooltip.reference, tooltip.element, {
                placement: tooltip_option.placement, // 'top', 'right', 'bottom', 'left', '{prefix}-start', '{prefix}-end'
                middleware: [
                    window.FloatingUIDOM.offset(6),
                    (tooltip.placement) ? window.FloatingUIDOM.flip(flip_options) : window.FloatingUIDOM.autoPlacement(autoPlacement_options),
                    window.FloatingUIDOM.shift(shift_options),
                    window.FloatingUIDOM.size(size_options),
                    (options.arrow) ? window.FloatingUIDOM.arrow(arrow_options) : null,
                ],
            }).then(({ x, y, placement, middlewareData }) => {
                Object.assign(tooltip.element.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });

                // Arrow
                if (options.arrow === true) {
                    // Accessing the data
                    const { x: arrowX, y: arrowY } = middlewareData.arrow;
                    const staticSide = {
                        top: 'bottom',
                        right: 'left',
                        bottom: 'top',
                        left: 'right',
                    }[placement.split('-')[0]];
                    let clipPath = null;
                    switch (placement) {
                        case 'top':
                            clipPath = 'polygon(100% 0%, 100% 100%, 0% 100%)';
                            break;
                        case 'right':
                            clipPath = 'polygon(100% 100%, 0% 100%, 0% 0%)';
                            break;
                        case 'bottom':
                            clipPath = 'polygon(0% 100%, 0% 0%, 100% 0%)';
                            break;
                        case 'left':
                            clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%)';
                            break;
                    }
                    Object.assign(arrow_elem.style, {
                        left: arrowX != null ? `${arrowX}px` : '',
                        top: arrowY != null ? `${arrowY}px` : '',
                        right: '',
                        bottom: '',
                        [staticSide]: '-4px',
                        clipPath: clipPath,
                    });
                }

            });
        }

        /** Check if tooltip can be shown */
        const _canShow = () => {
            if (!tooltip.reference) { // No reference found
                console.warn('No reference found for tooltip',tooltip);
                return false;
            }
            if (tooltip.device) {
                if (tooltip.device==='mobile' && !FloatingTooltips.isMobile) { // Only mobile, but device is not a mobile
                    return false;
                } else if (tooltip.device==='desktop' && FloatingTooltips.isMobile) { // Only desktop, but device is not a desktop
                    return false;
                }
            }
            return true;
        }
        tooltip._canShow = _canShow();

        /** Cleanup autoUpdater for this tooltip */
        if (tooltip._canShow) {
            tooltip._cleanup = window.FloatingUIDOM.autoUpdate(tooltip.reference, tooltip.element, tooltip._update);
        }

        /** Show this tooltip */
        tooltip.show = () => {
            if (tooltip._canShow) {
                tooltip.element.style.display = null;
                tooltip._update();
            }
        }

        /** Hide this tooltip */
        tooltip.hide = () => {
            tooltip.element.style.display = 'none';
            tooltip._update();
        }

        /** Delete this tooltip */
        tooltip.delete = () => {
            tooltip.element.remove();
            tooltip._cleanup();
        };

        // Show / Hide on mouse hovering
        if (tooltip._canShow) {
            if (tooltip.hover===true) {
                tooltip.reference.addEventListener('mouseover',tooltip.show);
                tooltip.reference.addEventListener('mouseout',tooltip.hide);
            } else if (options.hover===true && tooltip.hover!==false) {
                tooltip.reference.addEventListener('mouseover',tooltip.show);
                tooltip.reference.addEventListener('mouseout',tooltip.hide);
            }
        }

    }); // end forEach tooltip_option


    /** Attach element click to show all tooltips */
    if (options.trigger) {
        const trigger_element = document.querySelector(`${options.trigger}`);
        if (trigger_element) {
            trigger_element.addEventListener('click',FloatingTooltips.show);
        }
    }


    FloatingTooltips._autoshow();
    return FloatingTooltips;
}
