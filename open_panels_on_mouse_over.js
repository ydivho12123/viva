// https://forum.vivaldi.net/topic/28413/open-panels-on-mouse-over/22?_=1593504963587
(function() {
    'use strict';
    
    function panelMouseOver(autoHide, delay_show, delay_change, delay_hide) {
        function simulateClick(element) {
            element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }));
            element.dispatchEvent(new PointerEvent('mousedown', { bubbles: true, detail: 1 }));
            element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
            element.dispatchEvent(new PointerEvent('mouseup', { bubbles: true, detail: 1 }));
            element.dispatchEvent(new PointerEvent('click', { bubbles: true }));
        }
        
        function getActiveButton() {
            return document.querySelector('#switch .active > button');
        }
        
        function setActive(button, doDelay) {
            clearTimeout(show_token);
            const delay = doDelay ? (!getActiveButton() ? delay_show : delay_change) : 0;
            show_token = setTimeout(function() {
                simulateClick(button);
            }, delay);
        }
        
        function hidePanel() {
            if (document.querySelector('#panels-container.overlay:not(.icons)')) {
                setTimeout(function() {
                    const activeButton = getActiveButton();
                    if (activeButton) {
                        simulateClick(activeButton);
                    }
                }, delay_hide);
            }
        }
        
        function isPanelButton(element) {
            return element.matches('button:is([name^="Panel"], [name^="WEBPANEL_"]):not([name="PanelWeb"])');
        }
        
        function setListeners() {
            function eventHandler(event) {
                if (isPanelButton(event.target) && !event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
                    switch(event.type) {
                        case 'mouseenter':
                            setActive(event.target, true);
                            break;
                        case 'mouseleave':
                            clearTimeout(show_token);
                            break;
                        case 'dragenter':
                            setActive(event.target, false);
                            break;
                    }
                }
            }
            
            if (autoHide) {
                document.querySelector('#webview-container').addEventListener('mouseenter', hidePanel);
            }
            const panelSwitch = document.querySelector('#switch');
            panelSwitch.addEventListener('mouseenter', eventHandler, { capture: true });
            panelSwitch.addEventListener('mouseleave', eventHandler, { capture: true });
            panelSwitch.addEventListener('dragenter', eventHandler, { capture: true });
        }
        
        let show_token = null;
        setListeners();
    }
    
    setTimeout(function waitMouseOver() {
        const browser = document.querySelector('#browser');
        if (browser) {
            panelMouseOver(true, 100, 50, 250);
        } else {
            setTimeout(waitMouseOver, 300);
        }
    }, 300);
})();
