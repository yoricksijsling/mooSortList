                parent.getElements('.interactiveTable').each(function(el) {
                        new SortList({
                                elements: el.getElements('.sortlistitem'),
                                sortLinks: el.getElements('.sorttagselect')
                        })
                })

