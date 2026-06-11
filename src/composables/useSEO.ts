import { onMounted, onUnmounted } from 'vue'

interface SEOOptions {
  title?: string
  description?: string
  // keywords?: string
  // ogTitle?: string
  // ogDescription?: string
  // ogImage?: string
  // ogUrl?: string
}

export function useSEO(options: SEOOptions) {
  const createdElements: HTMLElement[] = []

  const setTitle = (title: string) => {
    document.title = title
  }

  const setOrUpdateMeta = (attr: 'name' | 'property', key: string, content: string) => {
    const selector = `meta[${attr}="${key}"]`
    let element = document.querySelector(selector) as HTMLMetaElement

    if (element) {
      element.setAttribute('content', content)
    } else {
      element = document.createElement('meta')
      element.setAttribute(attr, key)
      element.setAttribute('content', content)
      document.head.appendChild(element)
      createdElements.push(element)
    }
  }

  const applyMeta = () => {
    // Set title
    if (options.title) {
      setTitle(options.title)
    }

    // Set meta description
    if (options.description) {
      setOrUpdateMeta('name', 'description', options.description)
    }

    // Set meta keywords
    // if (options.keywords) {
    //   setOrUpdateMeta('name', 'keywords', options.keywords)
    // }

    // // Open Graph tags
    // if (options.ogTitle) {
    //   setOrUpdateMeta('property', 'og:title', options.ogTitle)
    // }

    // if (options.ogDescription) {
    //   setOrUpdateMeta('property', 'og:description', options.ogDescription)
    // }

    // if (options.ogImage) {
    //   setOrUpdateMeta('property', 'og:image', options.ogImage)
    // }

    // if (options.ogUrl) {
    //   setOrUpdateMeta('property', 'og:url', options.ogUrl)
    // }
  }

  onMounted(() => {
    applyMeta()
  })

  // Cleanup on unmount (optional, removes tags added by this component)
  onUnmounted(() => {
    createdElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })
  })

  return {
    updateSEO: applyMeta
  }
}