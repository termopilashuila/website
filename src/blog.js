/**
 * Blog Page Handler for Finca Termópilas
 * 
 * This module handles blog-specific functionality including:
 * - Category filtering for blog posts
 * - Blog post animations and interactions
 */

class BlogHandler {
    constructor() {
        this.categoryButtons = [];
        this.blogCards = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeCategoryFilters();
            this.initializeBlogCards();
        });
    }

    initializeCategoryFilters() {
        this.categoryButtons = document.querySelectorAll('.category-button');
        this.blogCards = document.querySelectorAll('.blog-card');

        if (this.categoryButtons.length === 0) {
            console.warn('No category buttons found');
            return;
        }

        // Add click event listeners to category buttons
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleCategoryFilter(e));
        });

        console.log(`Initialized blog category filters: ${this.categoryButtons.length} buttons, ${this.blogCards.length} cards`);
    }

    initializeBlogCards() {
        // Add any blog card specific functionality here
        this.blogCards.forEach((card, index) => {
            // Add entrance animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effects if needed
            this.addCardHoverEffects(card);
        });
    }

    handleCategoryFilter(event) {
        const button = event.target;
        const selectedCategory = button.getAttribute('data-category');

        // Update active button state
        this.updateActiveButton(button);

        // Filter blog cards
        this.filterBlogCards(selectedCategory);

        // Track category filter in Google Analytics
        this.trackCategoryFilter(selectedCategory);
    }

    updateActiveButton(activeButton) {
        // Remove active class from all buttons
        this.categoryButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Add active class to clicked button
        activeButton.classList.add('active');
    }

    filterBlogCards(category) {
        this.blogCards.forEach(card => {
            const cardCategories = card.getAttribute('data-categories');
            
            if (category === 'all' || this.cardMatchesCategory(cardCategories, category)) {
                this.showCard(card);
            } else {
                this.hideCard(card);
            }
        });

        // Update results count
        this.updateResultsCount(category);
    }

    cardMatchesCategory(cardCategories, targetCategory) {
        if (!cardCategories) return false;
        
        const categories = cardCategories.split(' ').map(cat => cat.trim().toLowerCase());
        return categories.includes(targetCategory.toLowerCase());
    }

    showCard(card) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Trigger animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }

    hideCard(card) {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    updateResultsCount(category) {
        const visibleCards = Array.from(this.blogCards).filter(card => {
            return card.style.display !== 'none';
        });

        // Create or update results message
        this.showResultsMessage(visibleCards.length, category);
    }

    showResultsMessage(count, category) {
        // Remove existing message
        const existingMessage = document.querySelector('.blog-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (count === 0) {
            const message = document.createElement('div');
            message.className = 'blog-results-message';
            message.innerHTML = `
                <p style="text-align: center; padding: 2rem; color: #666; font-style: italic;">
                    No se encontraron artículos para la categoría "${this.getCategoryDisplayName(category)}".
                </p>
            `;

            const blogGrid = document.querySelector('.blog-grid');
            if (blogGrid) {
                blogGrid.appendChild(message);
            }
        }
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'all': 'Todos',
            'vino': 'Vino',
            'cacao': 'Cacao',
            'turismo': 'Turismo',
            'gastronomia': 'Gastronomía',
            'recetas': 'Recetas',
            'experiencias': 'Experiencias'
        };

        return categoryNames[category] || category;
    }

    addCardHoverEffects(card) {
        const readMoreLink = card.querySelector('.read-more');
        
        if (readMoreLink) {
            card.addEventListener('mouseenter', () => {
                readMoreLink.style.color = '#F29F05';
            });

            card.addEventListener('mouseleave', () => {
                readMoreLink.style.color = '';
            });
        }
    }

    trackCategoryFilter(category) {
        if (window.gtag && typeof window.gtag === 'function') {
            window.gtag('event', 'blog_category_filter', {
                'event_category': 'blog',
                'event_label': category,
                'custom_map': {
                    'category': category
                }
            });
        }
    }

    // Public method to get current active category
    getActiveCategory() {
        const activeButton = document.querySelector('.category-button.active');
        return activeButton ? activeButton.getAttribute('data-category') : 'all';
    }

    // Public method to set category programmatically
    setCategory(category) {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    }
}

// Auto-initialize blog handler when script loads
window.blogHandler = new BlogHandler();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogHandler;
} 