import './style.css'
import colours from './colours.json'

const artworkFiles = import.meta.glob('./art/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const designs = Object.entries(artworkFiles).map(([path, svg]) => {
  const filename = path.split('/').pop()
  const name = filename.replace(/ lid\.svg$/i, '')

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    filename,
    svg,
  }
})

function getTextColour(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 145 ? '#000000' : '#ffffff'
}

let activeTarget = 'case'
let selectedDesign = designs[0]

const selectedColours = {
  case: '#FFFFFF',
  deboss: '#000000',
}

document.querySelector('#app').innerHTML = `
  <h1>HubbyCraft Studio custom dice trays</h1>

  <div class="app-layout">
    <div class="design-controls">
      <h2>Design</h2>

      <div id="design-grid">
        ${designs.map((design, index) => `
          <button
            class="design-option ${index === 0 ? 'selected' : ''}"
            data-filename="${design.filename}"
            type="button"
          >
            <span class="design-thumbnail">
              ${design.svg}
            </span>

            <span class="design-label">
              ${design.name}
            </span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="colour-controls">
      <div class="colour-tabs">
        <button
          class="tab-button active"
          data-target="case"
          type="button"
        >
          Case
        </button>

        <button
          class="tab-button"
          data-target="deboss"
          type="button"
        >
          Deboss
        </button>
      </div>

      <div id="colour-grid">
        ${colours.map(colour => `
          <button
            class="colour-option"
            data-hex="${colour.hex}"
            type="button"
            style="
              background-color: ${colour.hex};
              color: ${getTextColour(colour.hex)};
            "
          >
            ${colour.name}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="preview-controls">
      <h2>Dice tray lid preview</h2>

      <div id="preview">
        <div id="lid-background"></div>
        <div id="lid-art"></div>
      </div>
    </div>
  </div>
`

const lidBackground = document.querySelector('#lid-background')
const lidArt = document.querySelector('#lid-art')
const tabButtons = document.querySelectorAll('.tab-button')
const colourButtons = document.querySelectorAll('.colour-option')
const designButtons = document.querySelectorAll('.design-option')

function updatePreview() {
  lidBackground.style.backgroundColor = selectedColours.case
  lidArt.innerHTML = selectedDesign.svg

  const outline = lidArt.querySelector('#outline')

  if (outline) {
    outline.style.fill = selectedColours.deboss
  }
}

function updateSelectedColour() {
  colourButtons.forEach(button => {
    const isSelected =
      button.dataset.hex.toUpperCase() ===
      selectedColours[activeTarget].toUpperCase()

    button.classList.toggle('selected', isSelected)
  })
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeTarget = button.dataset.target

    tabButtons.forEach(tab => {
      tab.classList.toggle('active', tab === button)
    })

    updateSelectedColour()
  })
})

colourButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedColours[activeTarget] = button.dataset.hex

    updatePreview()
    updateSelectedColour()
  })
})

designButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedDesign = designs.find(
      design => design.filename === button.dataset.filename
    )

    designButtons.forEach(designButton => {
      designButton.classList.toggle(
        'selected',
        designButton === button
      )
    })

    updatePreview()
  })
})

updatePreview()
updateSelectedColour()