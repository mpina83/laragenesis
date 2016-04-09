'use strict';

angular
    .module('app')
    .config(function($translateProvider) {
        $translateProvider
        .useSanitizeValueStrategy('escape')
        .translations('en', {
            CHOOSE_LANGUAGE:'Choose language',
            HOME:           'Home',
            DASHBOARD:      'Dashboard',
            ICONS:          'Icons',
            FORMS:          'Forms',
            WIDGETS:        'Widgets',
            BUTTONS:        'Buttons',
            NOTIFICATIONS:  'Notifications',
            TABLES:         'Tables',
            SLIDERS:        'Sliders',
            CHARTS:         'Charts',
            ACCOUNT:        'Account',
            UPDATES:        'Updates',
            MESSAGES:       'Messages',
            TASKS:          'Tasks',
            COMMENTS:       'Comments',
            SETTINGS:       'Settings',
            PROFILE:        'Profile',
            PAYMENTS:       'Payments',
            PROJECTS:       'Projects',
            LOCK_ACCOUNT:   'Lock account',
            LOGOUT:         'Logout',
            CALENDAR:       'Calendar',
            ANIMATIONS:     'Animations'
        })
        .translations('es', {
            CHOOSE_LANGUAGE:'Elige lengua',
            HOME:           'Empezar',
            DASHBOARD:      'Tablero',
            ICONS:          'Iconos',
            FORMS:          'Formas',
            WIDGETS:        'Widget',
            BUTTONS:        'Botón',
            NOTIFICATIONS:  'Notificaciones',
            TABLES:         'Mesas',
            SLIDERS:        'Deslizador',
            CHARTS:         'Gráficas',
            ACCOUNT:        'Cuenta',
            UPDATES:        'Actualizaciones',
            MESSAGES:       'Mensajes',
            TASKS:          'Tareas',
            COMMENTS:       'Comentarios',
            SETTINGS:       'Ajustes',
            PROFILE:        'Perfilar',
            PAYMENTS:       'Pagos',
            PROJECTS:       'Proyectos',
            LOCK_ACCOUNT:   'Bloqueo de cuenta',
            LOGOUT:         'Cerrar sesion',
            CALENDAR:       'Calendario',
            ANIMATIONS:     'Animaciones'
        })
        .translations('pl', {
            CHOOSE_LANGUAGE:'Wybierz język',
            HOME:           'Start',
            DASHBOARD:      'Panel',
            ICONS:          'Ikony',
            FORMS:          'Formularze',
            WIDGETS:        'Widżety',
            BUTTONS:        'Przyciski',
            NOTIFICATIONS:  'Notyfikacje',
            TABLES:         'Tabele',
            SLIDERS:        'Suwaki',
            CHARTS:         'Wykresy',
            ACCOUNT:        'Konto',
            UPDATES:        'Aktualizacje',
            MESSAGES:       'Wiadomości',
            TASKS:          'Zadania',
            COMMENTS:       'Komentarze',
            SETTINGS:       'Ustawienia',
            PROFILE:        'Profil',
            PAYMENTS:       'Płatności',
            PROJECTS:       'Projekty',
            LOCK_ACCOUNT:   'Zablokuj konto',
            LOGOUT:         'Wyloguj',
            CALENDAR:       'Kalendarz',
            ANIMATIONS:     'Animacje'
        });
        $translateProvider.preferredLanguage('en');
    });
