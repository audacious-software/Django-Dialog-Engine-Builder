/* global requirejs */

requirejs.config({
  shim: {
    jquery: {
      exports: '$'
    },
    cookie: {
      exports: 'Cookies'
    },
    klayjs: {
      exports: '$klay'
    },
    dagre: {
      exports: 'dagre'
    },
    bootstrap: {
      deps: ['jquery']
    },
    'cytoscape-klay': {
      deps: ['klayjs']
    },
    'cytoscape-dagre': {
      deps: ['dagre']
    }
  },
  baseUrl: '/static/builder-js/js/app',
  paths: {
    app: '/static/builder-js/js/app',
    material: '/static/builder-js/vendor/material-components-web-11.0.0',
    jquery: '/static/builder-js/vendor/jquery-3.4.0.min',
    cookie: '/static/builder-js/vendor/js.cookie',
    cytoscape: '/static/builder-js/vendor/cytoscape-3.19.1.min',
    'cytoscape-klay': '/static/builder-js/vendor/cytoscape-klay',
    'cytoscape-dagre': '/static/builder-js/vendor/cytoscape-dagre',
    'cytoscape-cose-bilkent': '/static/builder-js/vendor/cytoscape-cose-bilkent',
    'cose-base': '/static/builder-js/vendor/cose-base',
    'layout-base': '/static/builder-js/vendor/layout-base',
    klayjs: '/static/builder-js/vendor/klay',
    dagre: '/static/builder-js/vendor/dagre.min'
  }
})

requirejs(['cytoscape', 'cytoscape-dagre', 'cytoscape-cose-bilkent', 'cose-base', 'layout-base', 'jquery'], function (cytoscape, cytoscapeDagre, cytoscapeCoseNilkent) {
  $('#cytoscape_canvas').height($(window).height())
  $('#cytoscape_canvas').width($(window).width())

  cytoscapeDagre(cytoscape) // register extension

  // cytoscape_cose_bilkent(cytoscape);

  const cy = cytoscape({
    container: $(window.visualizationOptions.container),
    elements: window.visualizationOptions.source,
    // 'zoomingEnabled': false,
    layout: {
      name: 'dagre',
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true
    },
    //      ready: function(){
    //          this.nodes().forEach(function(node){
    //              let width = [30, 70, 110];
    //              let size = width[Math.floor(Math.random()*3)];
    //              node.css("width", size);
    //              node.css("height", size);
    //          });
    //          this.layout({name: 'cose-bilkent', animationDuration: 1000}).run();
    //      },
    style: [{
      selector: 'node',
      style: {
        label: 'data(name)',
        'label-type': 'data(dde_node_type)',
        'font-size': '10pt',
        'text-halign': 'center',
        'text-valign': 'center',
        shape: 'round-rectangle',
        'compound-sizing-wrt-labels': 'include'
      }
    }, {
      selector: 'edge',
      style: {
        'curve-style': 'bezier',
        'control-point-distance': 64,
        'target-arrow-shape': 'triangle',
        label: 'data(dde_edge_description)',
        'font-size': '8pt',
        'text-rotation': 'autorotate',
        color: '#fff',
        'text-background-color': '#000',
        'text-background-opacity': 1,
        'text-background-shape': 'round-rectangle',
        'text-background-padding': '1px'
      }
    }, {
      selector: '.node_begin',
      style: {
        'background-color': '#BDBDBD',
        shape: 'round-rectangle',
        width: '100px',
        height: '50px'
      }
    }, {
      selector: '.node_end',
      style: {
        'background-color': '#BDBDBD',
        shape: 'round-rectangle',
        width: '100px',
        height: '50px'
      }
    }, {
      selector: '.node_branch-prompt',
      style: {
        'background-color': '#A5D6A7',
        shape: 'round-diamond',
        width: '50px',
        height: '50px'
      }
    }, {
      selector: '.node_random-branch',
      style: {
        'background-color': '#EF9A9A',
        shape: 'round-diamond',
        width: '50px',
        height: '50px'
      }
    }, {
      selector: '.node_branch-conditions',
      style: {
        'background-color': '#CE93D8',
        shape: 'round-diamond',
        width: '50px',
        height: '50px'
      }
    }, {
      selector: '.node_echo',
      style: {
        'background-color': '#90CAF9',
        shape: 'round-tag',
        width: '50px',
        height: '50px'
      }
    }, {
      selector: '.node_pause',
      style: {
        'background-color': '#90CAF9',
        shape: 'round-rectangle',
        width: '50px',
        height: '50px'
      }
    }, {
      selector: '.node_alert',
      style: {
        'background-color': '#D50000',
        shape: 'vee',
        width: '50px',
        height: '50px'
      }
    }, {
      selector: '.node_group',
      style: {
        'background-color': '#F5F5F5',
        shape: 'round-rectangle',
        'text-valign': 'top',
        'text-halign': 'center',
        'text-margin-y': '-10px',
        'font-weight': 'bold'
      }
    }]
  })

  cy.center()
})
