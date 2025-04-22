function aimmenu(menuElement, opts) {
    const options = Object.assign({
        rowSelector: '.has-sub',
        submenuSelector: '.is-sub',
        submenuDirection: 'right',
        tolerance: 75,
        enter: () => {},
        exit: () => {},
        activate: () => {},
        deactivate: () => {},
        exitMenu: () => {}
    }, opts);

    let activeRow = null;
    let mouseLocs = [];
    let lastDelayLoc = null;
    let timeoutId = null;
    const MOUSE_LOCS_TRACKED = 3;
    const DELAY = 300;

    function mousemoveDocument(e) {
        mouseLocs.push({ x: e.pageX, y: e.pageY });
        if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
            mouseLocs.shift();
        }
    }

    function mouseleaveMenu() {
        if (timeoutId) clearTimeout(timeoutId);

        if (options.exitMenu(menuElement) && activeRow) {
            options.deactivate(activeRow);
            activeRow = null;
        }
    }

    function mouseenterRow(row) {
        if (timeoutId) clearTimeout(timeoutId);

        options.enter(row);
        possiblyActivate(row);
    }

    function mouseleaveRow(row) {
        options.exit(row);
    }

    function clickRow(row) {
        activate(row);
    }

    function activate(row) {
        if (row === activeRow) return;

        if (activeRow) {
            options.deactivate(activeRow);
        }

        options.activate(row);
        activeRow = row;
    }

    function possiblyActivate(row) {
        const delay = activationDelay();

        if (delay) {
            timeoutId = setTimeout(() => possiblyActivate(row), delay);
        } else {
            activate(row);
        }
    }

    function activationDelay() {
        if (!activeRow || !activeRow.querySelector(options.submenuSelector)) {
            return 0;
        }

        const rect = menuElement.getBoundingClientRect();
        const offset = {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
        const upperLeft = { x: offset.left, y: offset.top - options.tolerance };
        const upperRight = { x: offset.left + menuElement.offsetWidth, y: upperLeft.y };
        const lowerLeft = { x: offset.left, y: offset.top + menuElement.offsetHeight + options.tolerance };
        const lowerRight = { x: offset.left + menuElement.offsetWidth, y: lowerLeft.y };

        const loc = mouseLocs[mouseLocs.length - 1];
        let prevLoc = mouseLocs[0];

        if (!loc) return 0;
        if (!prevLoc) prevLoc = loc;

        if (
            prevLoc.x < offset.left ||
            prevLoc.x > lowerRight.x ||
            prevLoc.y < offset.top ||
            prevLoc.y > lowerRight.y
        ) {
            return 0;
        }

        if (lastDelayLoc && loc.x === lastDelayLoc.x && loc.y === lastDelayLoc.y) {
            return 0;
        }

        function slope(a, b) {
            return (b.y - a.y) / (b.x - a.x);
        }

        let decreasingCorner = upperRight;
        let increasingCorner = lowerRight;

        if (options.submenuDirection === 'left') {
            decreasingCorner = lowerLeft;
            increasingCorner = upperLeft;
        } else if (options.submenuDirection === 'below') {
            decreasingCorner = lowerRight;
            increasingCorner = lowerLeft;
        } else if (options.submenuDirection === 'above') {
            decreasingCorner = upperLeft;
            increasingCorner = upperRight;
        }

        const decreasingSlope = slope(loc, decreasingCorner);
        const increasingSlope = slope(loc, increasingCorner);
        const prevDecreasingSlope = slope(prevLoc, decreasingCorner);
        const prevIncreasingSlope = slope(prevLoc, increasingCorner);

        if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
            lastDelayLoc = loc;
            return DELAY;
        }

        lastDelayLoc = null;
        return 0;
    }

    menuElement.addEventListener('mouseleave', mouseleaveMenu);

    const rows = menuElement.querySelectorAll(options.rowSelector);
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => mouseenterRow(row));
        row.addEventListener('mouseleave', () => mouseleaveRow(row));
        row.addEventListener('click', () => clickRow(row));
    });

    document.addEventListener('mousemove', mousemoveDocument);
}

// Инициализация
const menu = document.querySelector('.smart-menu');
if (!menu) {
    console.error('Меню с классом .smart-menu не найдено');
} else {
    aimmenu(menu, {
        activate: activateSubmenu,
        deactivate: deactivateSubmenu,
        submenuDirection: 'right',
        exitMenu: () => true
    });
}

// Функция активации
function activateSubmenu(row) {
    const submenu = row.querySelector('.is-sub');
    if (!submenu) return;

    const menu = document.querySelector('.smart-menu');
    const height = menu.offsetHeight;
    const width = menu.offsetWidth;

    submenu.style.display = 'block';
    submenu.style.top = '-1px';
    submenu.style.left = `${width - 3}px`;
    submenu.style.height = `${height - 4}px`;

    const link = row.querySelector('a');
    if (link) link.classList.add('maintainHover');
}

// Функция деактивации
function deactivateSubmenu(row) {
    const submenu = row.querySelector('.is-sub');
    if (submenu) submenu.style.display = 'none';

    const link = row.querySelector('a');
    if (link) link.classList.remove('maintainHover');
}

// Остановка всплытия кликов
document.querySelectorAll('.smart-menu .has-sub').forEach(li => {
    li.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});