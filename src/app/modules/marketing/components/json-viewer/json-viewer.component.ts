import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-viewer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.css']
})
export class JsonViewerComponent implements OnInit, AfterViewInit, OnDestroy {

  private workspace: any;
  private globalContainer: any;
  private diagram: any;
  private jsonInput: any;
  private generateBtn: any;
  private leftPanel: any;
  private togglePanelBtn: any;
  private centerViewBtn: any;
  private toggleThemeBtn: any;
  private selectedJson: any;
  private arrows: any;
  private rightPanel: any;
  private toggleRightPanelBtn: any;

  private scale = 1;
  private translateX = 0;
  private translateY = 0;
  private isPanelVisible = true;
  private isDragging = false;
  private startX: number = 0;
  private startY: number = 0; 
  private initialX: number = 0;
  private initialY: number = 0;
  private activeNode: any = null;
  private isRightPanelVisible = true;
  private isDraggingWorkspace = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeJsonViewer();
  }

  ngOnDestroy(): void {
    // Cleanup event listeners if needed
  }

  private initializeJsonViewer(): void {
    // Initialize DOM elements
    this.workspace = document.getElementById('workspace');
    this.globalContainer = document.getElementById('global-container');
    this.diagram = document.getElementById('diagram');
    this.jsonInput = document.getElementById('json-input');
    this.generateBtn = document.getElementById('generate');
    this.leftPanel = document.getElementById('left-panel');
    this.togglePanelBtn = document.getElementById('toggle-panel');
    this.centerViewBtn = document.getElementById('center-view');
    this.toggleThemeBtn = document.getElementById('toggle-theme');
    this.selectedJson = document.getElementById('selected-json');
    this.arrows = document.getElementById('arrows');
    this.rightPanel = document.getElementById('right-panel');
    this.toggleRightPanelBtn = document.getElementById('toggle-right-panel');

    // Set default JSON and initialize
    this.setDefaultJSON();
    this.setupEventListeners();
    this.loadApplication();
  }

  private setDefaultJSON(): void {
    const defaultJson = {
      "personCode": "8240562",
      "name": "Elsa Maria",
      "lastname": "Frutos Franco",
      "identification": {
        "codeSebaot": "1",
        "description": "8240562",
        "number": "8240562",
        "frontLink": "https://strategy-strat",
        "backLink": "https://strategy-strategy-",
        "expirationDate": "04/03/2037"
      },
      "gender": "M",
      "email": "nombre.apellido.2@itti.digital",
      "phone": {
        "number": "+595981556419"
      },
      "birthDate": "30/12/1985",
      "address": {
        "country": {
          "codeSebaot": "001000000000",
          "name": "Paraguay"
        },
        "department": {
          "id": "a51d9296-45ce-4d29-b03f-c087748191e1",
          "codeSebaot": "001017000000",
          "name": "Alto Paraguay"
        },
        "city": {
          "id": "bcc55afe-fba6-4109-97e4-367d2f431d59",
          "codeSebaot": "001017002000",
          "name": "Puerto Casado"
        },
        "streetName": "Av. Aviadores del chaco 765 11"
      }
    };

    if (this.jsonInput) {
      this.jsonInput.value = JSON.stringify(defaultJson, null, 2);
    }
  }

  private setupEventListeners(): void {
    // Theme toggle
    if (this.toggleThemeBtn) {
      this.toggleThemeBtn.addEventListener('click', () => {
        const app = document.querySelector('.json-viewer-app') as HTMLElement;
        if (app) {
          const currentTheme = app.getAttribute('data-theme');
          app.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
        }
      });
    }

    // Panel toggle
    if (this.togglePanelBtn) {
      this.togglePanelBtn.addEventListener('click', () => {
        this.isPanelVisible = !this.isPanelVisible;
        if (this.leftPanel) {
          this.leftPanel.style.transform = this.isPanelVisible ? 'translateX(0)' : 'translateX(-100%)';
        }
        this.togglePanelBtn.textContent = this.isPanelVisible ? '✕' : '☰';
      });
    }

    // Center view
    if (this.centerViewBtn) {
      this.centerViewBtn.addEventListener('click', () => {
        this.translateX = window.innerWidth / 2;
        this.translateY = window.innerHeight / 2;
        this.scale = 1;
        this.updateTransform();
      });
    }

    // Generate diagram
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => {
        try {
          const json = JSON.parse(this.jsonInput.value);
          this.generateDiagram(json);
        } catch (e) {
          alert('Invalid JSON format');
        }
      });
    }

    // Workspace interactions
    if (this.workspace) {
      this.workspace.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault();
        
        if (e.ctrlKey) {
          this.translateY -= e.deltaY;
        } else if (e.shiftKey) {
          this.translateX -= e.deltaX || e.deltaY;
        } else {
          const delta = e.deltaY > 0 ? 0.9 : 1.1;
          this.scale *= delta;
        }
        
        this.updateTransform();
      });

      this.workspace.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.target === this.workspace || e.target === this.diagram) {
          this.isDraggingWorkspace = true;
          this.lastMouseX = e.clientX;
          this.lastMouseY = e.clientY;
          this.workspace.style.cursor = 'grabbing';
        }
      });

      this.workspace.addEventListener('mousemove', (e: MouseEvent) => {
        if (this.isDraggingWorkspace) {
          const dx = e.clientX - this.lastMouseX;
          const dy = e.clientY - this.lastMouseY;

          this.translateX += dx;
          this.translateY += dy;

          this.lastMouseX = e.clientX;
          this.lastMouseY = e.clientY;

          this.updateTransform();
        }
      });

      this.workspace.addEventListener('mouseup', () => {
        this.isDraggingWorkspace = false;
        this.workspace.style.cursor = 'grab';
      });

      this.workspace.style.cursor = 'grab';
    }
  }

  private updateTransform(): void {
    if (this.globalContainer) {
      const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
      this.globalContainer.style.transform = transform;
    }
  }

  private generateDiagram(json: any): void {
    if (this.diagram) {
      this.diagram.innerHTML = '';
      // Reinsertar arrows para mantenerlo en el DOM
      if (this.arrows) {
        this.diagram.appendChild(this.arrows);
      }

      // Calcular posición inicial centrada
      const startX = 50;
      const startY = 50;

      this.generateNodes(json, startX, startY, '', 0);

      // Dibujar conexiones después de que todos los nodos se hayan creado
      setTimeout(() => {
        this.drawConnections();
      }, 100);

      // Centrar la vista
      this.translateX = 0;
      this.translateY = 0;
      this.scale = 1;
      this.updateTransform();
    }
  }

  private generateNodes(obj: any, x: number, y: number, parentKey: string = '', level: number = 0): HTMLElement {
    const node = this.createNode(obj, parentKey);
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.style.position = 'absolute';
    
    if (this.diagram) {
      this.diagram.appendChild(node);
    }

    // Obtener todos los campos que son objetos
    const childObjects = Object.entries(obj).filter(([_, value]) =>
      typeof value === 'object' && value !== null
    );

    if (childObjects.length > 0) {
      // Esperar a que el nodo se renderice para calcular su altura
      setTimeout(() => {
        const nodeHeight = node.offsetHeight || 150; // altura por defecto
        const spacing = 40; // espaciado adicional entre nodos
        const childX = x + 450; // Distancia horizontal desde el padre (aumentada)
        
        // Calcular la altura total que ocuparán todos los hijos
        const totalHeight = childObjects.length * (nodeHeight + spacing);
        let currentY = y - (totalHeight / 2) + (nodeHeight / 2);
        
        childObjects.forEach(([key, value], index) => {
          // Crear nodo hijo recursivamente
          this.generateNodes(value, childX, currentY, key, level + 1);
          currentY += nodeHeight + spacing;
        });
        
        // Dibujar conexiones después de crear todos los nodos hijos
        if (level === 0) {
          setTimeout(() => {
            this.drawConnections();
          }, 200);
        }
      }, 50);
    }
    
    return node;
  }

  private createNode(obj: any, title: string): HTMLElement {
    const node = document.createElement('div');
    node.className = 'node';
    
    // Force background styles inline para debug
    node.style.backgroundColor = '#2d2d2d';
    node.style.border = '1px solid #404040';
    node.style.borderRadius = '8px';
    node.style.padding = '12px';
    node.style.minWidth = '200px';
    node.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    const titleText = title ?
      (Array.isArray(obj) ? `[${title}]` : `{${title}}`) :
      'Root';

    node.innerHTML = `
      <div class="node-title">${titleText}</div>
      <div class="node-content">
        ${Object.keys(obj).map(key => {
          const value = obj[key];
          const valueType = typeof value;
          let displayValue = value;
          let valueStyle = '';
          let toggleButton = '';

          if (value === null) {
            displayValue = 'null';
          } else if (valueType === 'object') {
            const count = Array.isArray(value) ?
              `${value.length} items` :
              `${Object.keys(value).length} keys`;
            
            displayValue = Array.isArray(value) ?
              `[ ${count} ]` :
              `{ ${count} }`;
            toggleButton = '<span class="toggle-btn" data-expanded="true" title="Minimizar" style="display: inline-block; width: 16px; height: 16px; line-height: 14px; text-align: center; border: 1px solid #888888; border-radius: 3px; margin-left: 8px; cursor: pointer; user-select: none; color: #ffffff; background: #404040;">-</span>';
            valueStyle = 'color: #569CD6;'; // Blue color for objects

            return `<div data-key="${key}" class="node-field">
              <div class="node-field-content">
                <span style="color: #9cdcfe;">${key}</span>:
                <span style="${valueStyle}">${displayValue}</span>
                ${toggleButton}
              </div>
            </div>`;
          } else if (valueType === 'string') {
            displayValue = `"${value}"`;
            valueStyle = 'color: #ce9178;';
          } else if (valueType === 'number') {
            valueStyle = 'color: #b5cea8;';
          } else if (valueType === 'boolean') {
            valueStyle = 'color: #ce9178;';
          }

          return `<div class="node-field">
            <div class="node-field-content">
              <span style="color: #9cdcfe;">${key}</span>:
              <span style="${valueStyle}">${displayValue}</span>
            </div>
            ${toggleButton}
          </div>`;
        }).join('')}
      </div>
    `;

    // Add event handler for toggle buttons
    node.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('toggle-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const field = target.closest('.node-field') as HTMLElement;
        const key = field.getAttribute('data-key');
        const isExpanded = target.getAttribute('data-expanded') === 'true';

        // Find corresponding child node
        const childNode = this.findChildNode(node, key || '');
        if (childNode) {
          if (isExpanded) {
            // Collapse
            childNode.style.display = 'none';
            target.textContent = '+';
            target.setAttribute('data-expanded', 'false');
            target.setAttribute('title', 'Maximizar');
            // Also hide all descendant nodes
            this.hideDescendants(childNode);
          } else {
            // Expand
            childNode.style.display = '';
            target.textContent = '-';
            target.setAttribute('data-expanded', 'true');
            target.setAttribute('title', 'Minimizar');
          }
          this.updateConnections();
        }
        return; // Don't trigger other click handlers
      }
    });

    // Make node draggable
    node.addEventListener('mousedown', (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains('node-title')) {
        // Handle click vs drag on title
        const initialX = e.clientX;
        const initialY = e.clientY;
        const moveThreshold = 5; // pixels to consider as drag
        let hasMoved = false;

        const moveHandler = (e: MouseEvent) => {
          const dx = Math.abs(e.clientX - initialX);
          const dy = Math.abs(e.clientY - initialY);

          if (dx > moveThreshold || dy > moveThreshold) {
            hasMoved = true;
            // Start dragging
            this.isDragging = true;
            const dx = (e.clientX - this.startX) / this.scale;
            const dy = (e.clientY - this.startY) / this.scale;
            this.updateNodePosition(node, this.initialX + dx, this.initialY + dy);
          }
        };

        const upHandler = () => {
          document.removeEventListener('mousemove', moveHandler);
          document.removeEventListener('mouseup', upHandler);

          if (!hasMoved) {
            // If no drag occurred, toggle right panel and show content
            this.isRightPanelVisible = !this.isRightPanelVisible;
            if (this.rightPanel) {
              this.rightPanel.style.transform = this.isRightPanelVisible ? 'translateX(0)' : 'translateX(100%)';
            }
            if (this.toggleRightPanelBtn) {
              this.toggleRightPanelBtn.textContent = this.isRightPanelVisible ? '→' : '←';
              const rightPanelWidth = this.isRightPanelVisible ? parseInt(getComputedStyle(this.rightPanel).width) : 0;
              this.toggleRightPanelBtn.style.right = this.isRightPanelVisible ? `${rightPanelWidth}px` : '0';
            }

            // Update content with formatting
            if (this.selectedJson) {
              const formattedHtml = this.formatJsonWithColors(obj);
              this.selectedJson.innerHTML = `<div class="json-content" style="white-space: pre">${formattedHtml}</div>`;
            }
          }
        };

        // Save initial node position
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.initialX = node.offsetLeft;
        this.initialY = node.offsetTop;

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
        return;
      }

      // Handle dragging from rest of node
      this.isDragging = true;
      this.activeNode = node;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.initialX = node.offsetLeft;
      this.initialY = node.offsetTop;

      const moveHandler = (e: MouseEvent) => {
        if (this.isDragging) {
          const dx = (e.clientX - this.startX) / this.scale;
          const dy = (e.clientY - this.startY) / this.scale;
          this.updateNodePosition(node, this.initialX + dx, this.initialY + dy);
        }
      };

      const upHandler = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    });

    return node;
  }

  private formatJsonWithColors(obj: any, indent: string = ''): string {
    if (obj === null) return 'null';

    if (typeof obj !== 'object') {
      if (typeof obj === 'string') return `<span class="string">"${obj}"</span>`;
      if (typeof obj === 'number') return `<span class="number">${obj}</span>`;
      if (typeof obj === 'boolean') return `<span class="boolean">${obj}</span>`;
      return obj;
    }

    const isArray = Array.isArray(obj);
    let result = isArray ? '[\n' : '{\n';
    const nextIndent = indent + '    ';

    Object.entries(obj).forEach(([key, value], index) => {
      result += nextIndent;
      if (!isArray) {
        result += `<span class="key">"${key}"</span>: `;
      }
      result += this.formatJsonWithColors(value, nextIndent);
      if (index < Object.keys(obj).length - 1) {
        result += ',';
      }
      result += '\n';
    });

    result += indent + (isArray ? ']' : '}');
    return result;
  }

  private loadApplication(): void {
    // Initialize with dark theme (like original HTML)
    const app = document.querySelector('.json-viewer-app') as HTMLElement;
    if (app) {
      app.setAttribute('data-theme', 'dark');
    }

    // Hide right panel initially
    if (this.rightPanel) {
      this.rightPanel.style.transform = 'translateX(100%)';
    }
    if (this.toggleRightPanelBtn) {
      this.toggleRightPanelBtn.textContent = '←';
      this.toggleRightPanelBtn.style.right = '0';
    }

    // Initialize resize functionality
    this.initializeResizePanels();

    // Initialize position button
    this.updateToggleButtonPosition();

    // Setup ResizeObserver for left panel
    if (this.leftPanel) {
      new ResizeObserver(() => this.updateToggleButtonPosition()).observe(this.leftPanel);
    }

    // Set SVG dimensions to match global container
    if (this.arrows) {
      this.arrows.setAttribute('width', '100000');
      this.arrows.setAttribute('height', '100000');
      this.arrows.style.width = '100000px';
      this.arrows.style.height = '100000px';
      this.arrows.style.overflow = 'visible';
    }

    // Generate initial diagram
    setTimeout(() => {
      // Format initial JSON
      this.setupJsonInputFormatting();
      
      if (this.generateBtn) {
        this.generateBtn.click();
      }
      
      // Center view initially
      if (this.centerViewBtn) {
        this.centerViewBtn.click();
      }
    }, 100);
  }

  private setupJsonInputFormatting(): void {
    if (!this.jsonInput) return;

    // Input event for real-time formatting
    this.jsonInput.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      try {
        const obj = JSON.parse(target.value);
        const formattedHtml = this.formatJsonWithColors(obj);
        const wrapper = document.createElement('div');
        wrapper.className = 'json-content';
        wrapper.style.whiteSpace = 'pre';
        wrapper.innerHTML = formattedHtml;

        // Replace textarea content with formatted div
        target.style.display = 'none';
        if (!target.nextSibling || !(target.nextSibling as Element)?.classList?.contains('json-content')) {
          target.parentNode?.insertBefore(wrapper, target.nextSibling);
        } else {
          (target.nextSibling as Element).innerHTML = formattedHtml;
        }

        // Add click event for editing
        wrapper.addEventListener('click', () => {
          target.style.display = 'block';
          wrapper.style.display = 'none';
          target.focus();
          target.value = JSON.stringify(obj, null, 2);
        });
      } catch (e) {
        // Show normal textarea on parsing error
        target.style.display = 'block';
        const nextSibling = target.nextSibling as Element;
        if (nextSibling?.classList?.contains('json-content')) {
          nextSibling.remove();
        }
      }
    });

    // Blur event for formatting
    this.jsonInput.addEventListener('blur', (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      try {
        const obj = JSON.parse(target.value);
        const formattedHtml = this.formatJsonWithColors(obj);

        const nextSibling = target.nextSibling as Element;
        if (nextSibling?.classList?.contains('json-content')) {
          nextSibling.innerHTML = formattedHtml;
          target.style.display = 'none';
          (nextSibling as HTMLElement).style.display = 'block';
        } else {
          const wrapper = document.createElement('div');
          wrapper.className = 'json-content';
          wrapper.style.whiteSpace = 'pre';
          wrapper.innerHTML = formattedHtml;
          target.parentNode?.insertBefore(wrapper, target.nextSibling);
          target.style.display = 'none';

          wrapper.addEventListener('click', () => {
            target.style.display = 'block';
            wrapper.style.display = 'none';
            target.focus();
            target.value = JSON.stringify(obj, null, 2);
          });
        }
      } catch (e) {
        target.style.display = 'block';
      }
    });

    // Trigger initial formatting
    this.jsonInput.dispatchEvent(new Event('input'));
  }

  private updateToggleButtonPosition(): void {
    if (!this.togglePanelBtn || !this.leftPanel) return;
    const panelWidth = parseInt(getComputedStyle(this.leftPanel).width);
    this.togglePanelBtn.style.transform = this.isPanelVisible ? `translateX(${panelWidth}px)` : 'translateX(0)';
  }

  private initializeResizePanels(): void {
    const leftHandle = document.querySelector('#left-panel .resize-handle') as HTMLElement;
    const rightHandle = document.querySelector('#right-panel .resize-handle') as HTMLElement;

    if (leftHandle && this.leftPanel) {
      this.initializeResize(this.leftPanel, leftHandle, true);
    }
    if (rightHandle && this.rightPanel) {
      this.initializeResize(this.rightPanel, rightHandle, false);
    }
  }

  private initializeResize(panel: HTMLElement, handle: HTMLElement, isLeftPanel: boolean): void {
    let startX: number;
    let startWidth: number;

    const mouseDownHandler = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = parseInt(getComputedStyle(panel).width, 10);
      document.addEventListener('mousemove', resizeHandler);
      document.addEventListener('mouseup', stopResizeHandler);
      e.preventDefault();
    };

    const resizeHandler = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      let newWidth: number;

      if (isLeftPanel) {
        newWidth = startWidth + diff;
        if (this.togglePanelBtn) {
          this.togglePanelBtn.style.right = (300 - diff) + 'px';
        }
      } else {
        newWidth = startWidth - diff;
        if (this.toggleRightPanelBtn) {
          this.toggleRightPanelBtn.style.right = newWidth + 'px';
        }
      }

      // Limit size between min and max width
      newWidth = Math.max(200, Math.min(800, newWidth));
      panel.style.width = `${newWidth}px`;

      // Update toggle button positions
      if (isLeftPanel && this.togglePanelBtn) {
        this.togglePanelBtn.style.right = `${300 - diff}px`;
      } else if (!isLeftPanel && this.toggleRightPanelBtn) {
        this.toggleRightPanelBtn.style.right = `${newWidth}px`;
      }
    };

    const stopResizeHandler = () => {
      document.removeEventListener('mousemove', resizeHandler);
      document.removeEventListener('mouseup', stopResizeHandler);
    };

    handle.addEventListener('mousedown', mouseDownHandler);
  }

  private drawConnections(): void {
    if (!this.arrows) return;

    // Clear existing connections
    this.arrows.innerHTML = `
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#569CD6"/>
        </marker>
      </defs>
    `;

    const nodes = document.querySelectorAll('.node');
    const nodeArray = Array.from(nodes);
    
    // Skip root node (first node)
    for (let i = 1; i < nodeArray.length; i++) {
      const childNode = nodeArray[i] as HTMLElement;
      const childTitle = this.getNodeTitle(childNode);
      
      // Find parent node that has this child's key
      const parentNode = this.findParentNodeByKey(nodeArray, childTitle);
      
      if (parentNode) {
        const sourceField = parentNode.querySelector(`[data-key="${childTitle}"]`) as HTMLElement;
        if (sourceField) {
          this.drawArrow(parentNode as HTMLElement, childNode, sourceField);
        }
      }
    }
  }

  private getNodeTitle(node: HTMLElement): string {
    const titleElement = node.querySelector('.node-title') as HTMLElement;
    if (!titleElement) return '';
    return titleElement.textContent?.replace(/[{}\[\]]/g, '') || '';
  }

  private findParentNodeByKey(nodes: Element[], childKey: string): HTMLElement | null {
    for (let node of nodes) {
      const fieldElement = node.querySelector(`[data-key="${childKey}"]`);
      if (fieldElement) {
        return node as HTMLElement;
      }
    }
    return null;
  }


  private drawArrow(from: HTMLElement, to: HTMLElement, sourceField: HTMLElement): void {
    if (!this.arrows) return;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'connection');

    // Create path and anchor points
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startAnchor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const endAnchor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    path.setAttribute('class', 'arrow');
    startAnchor.setAttribute('class', 'anchor-point');
    endAnchor.setAttribute('class', 'anchor-point');

    // Save references for updates
    (group as any).sourceField = sourceField;
    (group as any).targetNode = to;
    (group as any).path = path;
    (group as any).startAnchor = startAnchor;
    (group as any).endAnchor = endAnchor;

    // Add elements to group
    group.appendChild(path);
    group.appendChild(startAnchor);
    group.appendChild(endAnchor);
    this.arrows.appendChild(group);

    // Update initial positions
    this.updateConnection(group);
  }

  private updateConnection(connection: SVGGElement): void {
    const sourceField = (connection as any).sourceField;
    const targetNode = (connection as any).targetNode;
    const path = (connection as any).path;
    const startAnchor = (connection as any).startAnchor;
    const endAnchor = (connection as any).endAnchor;

    if (!sourceField || !targetNode || targetNode.style.display === 'none') {
      connection.style.display = 'none';
      return;
    }

    connection.style.display = '';

    // Get parent node of the source field
    const parentNode = sourceField.closest('.node') as HTMLElement;
    
    if (!parentNode) return;

    // Calculate precise connection points using offset positions
    // From: right edge of the parent node at the specific field's vertical position
    const fromX = parentNode.offsetLeft + parentNode.offsetWidth;
    const fromY = parentNode.offsetTop + sourceField.offsetTop + (sourceField.offsetHeight / 2);
    
    // To: left edge of target node, vertically centered
    const toX = targetNode.offsetLeft;
    const toY = targetNode.offsetTop + (targetNode.offsetHeight / 2);

    // Create L-shaped connection path
    const midX = fromX + Math.max(50, (toX - fromX) * 0.5);
    const d = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#569CD6');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('marker-end', 'url(#arrowhead)');

    // Update anchor points
    if (startAnchor) {
      startAnchor.setAttribute('cx', fromX.toString());
      startAnchor.setAttribute('cy', fromY.toString());
      startAnchor.setAttribute('r', '3');
      startAnchor.setAttribute('fill', '#569CD6');
    }
    
    if (endAnchor) {
      endAnchor.setAttribute('cx', toX.toString());
      endAnchor.setAttribute('cy', toY.toString());
      endAnchor.setAttribute('r', '3');
      endAnchor.setAttribute('fill', '#569CD6');
    }
  }

  private updateConnections(): void {
    if (!this.arrows) return;
    
    const connections = this.arrows.querySelectorAll('.connection');
    connections.forEach((connection: Element) => {
      const targetNode = (connection as any).targetNode;
      if (targetNode) {
        connection.setAttribute('style', targetNode.style.display === 'none' ? 'display: none' : '');
        if (targetNode.style.display !== 'none') {
          this.updateConnection(connection as SVGGElement);
        }
      }
    });
  }

  private findChildNode(parentNode: HTMLElement, key: string): HTMLElement | null {
    const nodes = document.querySelectorAll('.node');
    for (let node of nodes) {
      const titleElement = node.querySelector('.node-title') as HTMLElement;
      const fullTitle = titleElement?.textContent || '';
      const nodeTitle = fullTitle.replace(/[{}\[\]]/g, '') || '';
      if (nodeTitle === key) {
        return node as HTMLElement;
      }
    }
    return null;
  }

  private hideDescendants(node: HTMLElement): void {
    // Find all toggle buttons in this node and collapse them
    const toggleButtons = node.querySelectorAll('.toggle-btn[data-expanded="true"]');
    toggleButtons.forEach((button) => {
      const field = button.closest('.node-field') as HTMLElement;
      const key = field?.getAttribute('data-key');
      if (key) {
        const childNode = this.findChildNode(node, key);
        if (childNode && childNode.style.display !== 'none') {
          childNode.style.display = 'none';
          button.textContent = '+';
          button.setAttribute('data-expanded', 'false');
          button.setAttribute('title', 'Maximizar');
          // Recursively hide descendants
          this.hideDescendants(childNode);
        }
      }
    });
  }

  private updateNodePosition(node: HTMLElement, x: number, y: number): void {
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    // Update connections immediately after position change
    setTimeout(() => {
      this.updateConnections();
    }, 10);
  }
}