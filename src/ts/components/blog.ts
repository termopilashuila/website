// Function to parse Spanish dates like "5 de abril, 2024" into Date objects
function parseSpanishDate(dateString: string): Date {
  const monthMap: { [key: string]: number } = {
    'enero': 0,
    'febrero': 1,
    'marzo': 2, 
    'abril': 3,
    'mayo': 4,
    'junio': 5,
    'julio': 6,
    'agosto': 7,
    'septiembre': 8,
    'octubre': 9,
    'noviembre': 10,
    'diciembre': 11
  };

  // Format: "5 de abril, 2024"
  const parts = dateString.split(' ');
  if (parts.length === 4) {
    const day = parseInt(parts[0], 10);
    const month = monthMap[parts[2].replace(',', '')];
    const year = parseInt(parts[3], 10);
    
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  // Return oldest possible date if parsing fails
  return new Date(0);
}

// Function to sort blog entries by date (most recent first)
function sortBlogEntriesByDate(): void {
  const blogGrid = document.querySelector('.blog-grid');
  if (!blogGrid) return;
  
  const blogCards = Array.from(document.querySelectorAll('.blog-card'));
  if (blogCards.length <= 1) return; // No need to sort if there's only one or no entries
  
  // Sort blog cards by date (most recent first)
  blogCards.sort((a, b) => {
    const dateA = a.querySelector('.blog-date');
    const dateB = b.querySelector('.blog-date');
    
    if (!dateA || !dateB) return 0;
    
    const dateAObj = parseSpanishDate(dateA.textContent || '');
    const dateBObj = parseSpanishDate(dateB.textContent || '');
    
    // Sort in descending order (most recent first)
    return dateBObj.getTime() - dateAObj.getTime();
  });
  
  // Clear and reapply the sorted cards
  blogCards.forEach(card => {
    blogGrid.appendChild(card);
  });
}

// Function to initialize blog category filtering
export function initBlogCategoryFiltering(): void {
  const categoryButtons = document.querySelectorAll('.category-button');
  const blogCards = document.querySelectorAll('.blog-card');
  
  // First, sort the blog entries by date
  sortBlogEntriesByDate();
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get selected category
      const selectedCategory = button.getAttribute('data-category');
      
      // Filter blog cards
      blogCards.forEach(card => {
        const cardElement = card as HTMLElement;
        if (selectedCategory === 'all') {
          cardElement.style.display = 'block';
        } else {
          const cardCategories = card.getAttribute('data-categories');
          if (cardCategories && cardCategories.includes(selectedCategory)) {
            cardElement.style.display = 'block';
          } else {
            cardElement.style.display = 'none';
          }
        }
      });
    });
  });
} 