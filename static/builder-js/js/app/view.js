requirejs.config({
    shim: {
        jquery: {
            exports: "$"
        },
        cookie: {
            exports: "Cookies"
        },
        klayjs: {
            exports: "$klay"
        },
        dagre: {
            exports: "dagre"
        },
        bootstrap: {
            deps: ["jquery"]
        },
        "cytoscape-klay": {
            deps: ["klayjs"]
        },
        "cytoscape-dagre": {
            deps: ["dagre"]
        },
    },
    baseUrl: "/static/builder-js/js/app",
    paths: {
        app: '/static/builder-js/js/app',
        material: "/static/builder-js/vendor/material-components-web-11.0.0",
        jquery: "/static/builder-js/vendor/jquery-3.4.0.min",
        cookie: "/static/builder-js/vendor/js.cookie",
        cytoscape: "/static/builder-js/vendor/cytoscape-3.19.1.min",
        "cytoscape-klay": "/static/builder-js/vendor/cytoscape-klay",
        "cytoscape-dagre": "/static/builder-js/vendor/cytoscape-dagre",
        klayjs: '/static/builder-js/vendor/klay',
        dagre: '/static/builder-js/vendor/dagre.min'
    }
});

requirejs(["material", "cookie", "jquery", "cytoscape", "cytoscape-dagre"], function(mdc, Cookies, Node, cytoscape, cytoscape_dagre) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'));

    var selectedDialog = null;

    topAppBar.setScrollTarget(document.getElementById('main-content'));
    
    cytoscape_dagre(cytoscape); // register extension
    
    var cy = cytoscape({
    	'container': $(window.visualizationOptions.container),
    	'elements': window.visualizationOptions.source,
 	 	// 'zoomingEnabled': false,
    	'layout': {
			name: 'dagre'
		}, 'style': [{
			selector: 'node',
			style: {
				'label': 'data(name)',
				'font-size': '10pt',
				'text-halign': 'center',
				'text-valign': 'center',
				'shape': 'round-rectangle',
				'compound-sizing-wrt-labels': 'include'
			}
		}, {
			selector: 'edge',
			style: {
				'curve-style': 'bezier',
				'control-point-distance': 64,
				'target-arrow-shape': 'triangle',
				'label': 'data(dde_edge_description)',
				'font-size': '8pt',
				'text-rotation': 'autorotate',
				'color': '#fff',
				'text-background-color': '#000',
				'text-background-opacity': 1,
				'text-background-shape': 'round-rectangle',
				'text-background-padding': '1px'
			}		
		}]
	});
	
	cy.center();
	
	console.log("DONE");
});