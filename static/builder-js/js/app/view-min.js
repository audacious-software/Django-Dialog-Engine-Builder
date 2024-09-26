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

requirejs(['material', 'cytoscape', 'cytoscape-dagre', 'cytoscape-cose-bilkent', 'cose-base', 'layout-base', 'jquery'], function (mdc, cytoscape, cytoscapeDagre, cytoscapeCoseNilkent) {
  window.setTimeout(function () {
    console.log(`Preview window: ${$(window).width()} x ${$(window).height()}`)

    $('#cytoscape_canvas').height($(window).height())
    $('#cytoscape_canvas').width($(window).width())

    cytoscapeDagre(cytoscape) // register extension

    const cy = cytoscape({
      container: $(window.visualizationOptions.container),
      elements: window.visualizationOptions.source,
      // 'zoomingEnabled': false,
      layout: {
        name: 'dagre',
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true
      },
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
      }, {
        selector: '.mouse_hover',
        style: {
          'border-width': '1px',
          'border-opacity': '1.0',
          'border-color': 'black'
        }
      }, {
        selector: '.search_match',
        style: {
          'background-color': '#B39DDB',
          'border-width': '10px',
          'border-opacity': '1.0',
          'border-color': '#673AB7'
        }
      }]
    })

    cy.on('tap', 'node', function (evt) {
      const node = evt.target

      if (node.hasClass('node_group') === false) {
        window.parent.dialogBuilder.loadNodeById(node.id())

        window.parent.dialogBuilder.closeGraphView()
      }
    })

    cy.on('mouseover', 'node', function (evt) {
      const node = evt.target

      if (node.hasClass('node_group') === false) {
        document.body.style.cursor = 'pointer'

        node.addClass('mouse_hover')
      }
    })

    cy.on('mouseout', 'node', function (evt) {
      const node = evt.target

      node.removeClass('mouse_hover')

      document.body.style.cursor = 'auto'
    })

    cy.center()

    mdc.textField.MDCTextField.attachTo(document.getElementById('search_field'))

    const nodes = cy.nodes()

    $('#search_field_text').on('input', function () {
      let query = $('#search_field input').val()

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        node.removeClass('search_match')
      }

      $('#node_count').html(`${nodes.length}`)
      $('#node_matching').hide()

      if (query !== '') {
        query = query.toLowerCase()

        let matches = 0

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]

          let search = JSON.stringify(node.data('dde_search_text'))

          if (search !== undefined) {
            search = search.toLowerCase()

            if (search.includes(query)) {
              node.addClass('search_match')

              matches += 1
            }
          }
        }

        $('#node_matching').show()

        $('#node_count').html(`${matches}`)
      }
    })

    $('#node_count').html(`${nodes.length}`)
    $('#node_matching').hide()
  }, 250)
})
