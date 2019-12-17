/*! jQuery SVG to Inline v0.1.4
*   https://github.com/tiagoporto/jquery-svg-to-inline
*   Copyright (c) 2016-2017 Tiago Porto (tiagoporto.com)
*   Released under the MIT license
*/

'use strict';

$.fn.svgToInline = function (options) {
    'use strict';

    var trigger = {
        class: function() {
            if(jQuery.fn.jquery.match(/^(1|2)/)) {
                return this.selector.replace('.', '');
            } else {
                return $(this).attr('class');
            }
        },
        useClass: options && options.useTriggerClass || false
    };

    this.each(function () {
        var svg = {
            currency: $(this),
            oldClass: '',
            newClass: '',
            path: $(this).attr('data') || $(this).attr('src')
        },
            request = {
            element: '',
            svgTag: '',
            svgTagWithoutClass: ''
        },
            inputClass = $(this).attr('class').split(' '),
            inputClassLength = inputClass.length;

        if (inputClassLength > 0) {
            for (var i = 0; i < inputClassLength; ++i) {
                var space = '';

                if (inputClass[i] === trigger.class && !trigger.useClass) {
                    continue;
                }

                i !== inputClass.length - 1 && (space = ' ');
                inputClass[i] && (svg.newClass += inputClass[i] + space);
            }
        }

        $.ajax({
            url: svg.path,
            dataType: 'text',
            success: function success(response) {
                request.element = response.replace(/<[?!][^>]*>/g, ''), request.svgTag = request.element.match(/<svg[^>]*>/g);
                request.svgTagWithoutClass = request.svgTag[0].replace(/class=\"[^"]*\"/, '');
                svg.oldClass = request.svgTag[0].match(/class=\"(.*?)\"/);

                // If exist class in svg add to svg.newClass
                svg.oldClass && svg.oldClass[1] && svg.newClass && (svg.newClass = svg.oldClass[1] + ' ' + svg.newClass);

                svg.newClass !== '' && (svg.newClass = 'class="' + svg.newClass + '"');

                request.svgTagWithoutClass = request.svgTagWithoutClass.replace('>', ' ' + svg.newClass + '>');

                svg.currency.replaceWith(request.element.replace(/<svg[^>]*>/g, request.svgTagWithoutClass));
            }
        });
    });
};