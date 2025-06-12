// src/api/blogApi.js

// Simulate a network delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Mock Data - In a real app, this would come from a server
export let mockArticles = [ // Changed to export let
    {
        id: 'es2024-features',
        title: 'Modern JavaScript ES2024 Features You Should Know',
        excerpt: 'Exploring the latest JavaScript features including new array methods, improved async handling, and enhanced type safety features.',
        imageUrl: 'https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg',
        category: 'javascript',
        date: '2024-12-15',
        readTime: '8 min read',
        tags: ['JavaScript', 'ES2024', 'Modern Web'],
        featured: true,
        canEdit: true, // New property
        likes: false, // New property: true for liked, false for disliked/none
        dislikes: false // New property: true for disliked, false for liked/none
    },
    {
        id: 'react-server-components',
        title: 'React 19 Server Components Deep Dive',
        excerpt: 'Understanding the fundamentals of React Server Components and how they\'re changing React applications.',
        imageUrl: 'https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg',
        category: 'react',
        date: '2024-12-12',
        readTime: '6 min read',
        tags: ['React', 'Server Components'],
        featured: false,
        canEdit: true,
        likes: false,
        dislikes: false
    },
    {
        id: 'css-container-queries',
        title: 'CSS Container Queries: The Future of Responsive Design',
        excerpt: 'How container queries are revolutionizing responsive design by allowing components to adapt to their container size.',
        imageUrl: 'https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg',
        category: 'css',
        date: '2024-12-10',
        readTime: '4 min read',
        tags: ['CSS', 'Responsive Design'],
        featured: false,
        canEdit: false, // Example of non-editable
        likes: false,
        dislikes: false
    },
    {
        id: 'nodejs-postgresql-api',
        title: 'Building Scalable APIs with Node.js and PostgreSQL',
        excerpt: 'Best practices for creating robust, scalable REST APIs using Node.js, Express, and PostgreSQL.',
        imageUrl: 'https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg',
        category: 'nodejs',
        date: '2024-12-08',
        readTime: '10 min read',
        tags: ['Node.js', 'PostgreSQL', 'API'],
        featured: false,
        canEdit: true,
        likes: false,
        dislikes: false
    },
    {
        id: 'vscode-extensions',
        title: '10 VS Code Extensions Every Developer Should Use',
        excerpt: 'Essential VS Code extensions that will boost your productivity and make your development workflow more efficient.',
        imageUrl: 'https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg',
        category: 'tips',
        date: '2024-12-05',
        readTime: '3 min read',
        tags: ['VS Code', 'Productivity', 'Tips'],
        featured: false,
        canEdit: true,
        likes: false,
        dislikes: false
    },
    {
        id: 'typescript-generics',
        title: 'Complete Guide to TypeScript Generic Patterns',
        excerpt: 'Master TypeScript generics with practical examples and advanced patterns for type-safe and reusable code.',
        imageUrl: 'https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg',
        category: 'tutorials',
        date: '2024-12-03',
        readTime: '12 min read',
        tags: ['TypeScript', 'Generics', 'Tutorials'],
        featured: false,
        canEdit: true,
        likes: false,
        dislikes: false
    },
    // Add many more mock articles to reach 500+ for demonstration
    ...Array.from({ length: 494 }, (_, i) => ({
        id: `article-${i + 7}`,
        title: `Generic Article Title ${i + 7}`,
        excerpt: `This is a generic excerpt for article number ${i + 7}. It covers various topics to fill the space.`,
        imageUrl: `https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg`,
        category: ['tech', 'lifestyle', 'education', 'news'][Math.floor(Math.random() * 4)],
        date: new Date(2024, 0, i + 1).toISOString().slice(0, 10),
        readTime: `${(i % 5) + 3} min read`,
        tags: ['misc', 'general', 'info'],
        featured: i % 10 === 0, // Mark every 10th as featured
        canEdit: Math.random() > 0.5,
        likes: false,
        dislikes: false
    }))
];

// In a real app, this would be content from a database or markdown files
// This object is used internally by getArticleById to simulate full content
const fullArticleContent = { // No longer exported, internal to this file
    'es2024-features': {
        title: 'Modern JavaScript ES2024 Features You Should Know',
        content: `
            <h1>Modern JavaScript ES2024 Features You Should Know</h1>
            <div class="article-meta">
                <span>Published on December 15, 2024</span> • <span>8 min read</span>
            </div>
            
            <p>JavaScript continues to evolve rapidly, and ES2024 brings exciting new features that will transform how we write modern web applications. Let's explore the most impactful additions to the language.</p>
            
            <h2>1. Array Grouping Methods</h2>
            <p>The new <code>Object.groupBy()</code> and <code>Map.groupBy()</code> methods provide a native way to group array elements:</p>
            <pre><code>const inventory = [
  { name: 'asparagus', type: 'vegetables', quantity: 5 },
  { name: 'bananas', type: 'fruit', quantity: 0 },
  { name: 'goat', type: 'meat', quantity: 23 },
  { name: 'cherries', type: 'fruit', quantity: 5 },
];

const result = Object.groupBy(inventory, ({ type }) => type);
// { vegetables: [...], fruit: [...], meat: [...] }</code></pre>
            
            <h2>2. Promise.withResolvers()</h2>
            <p>This new static method provides a cleaner way to create Promise instances with external resolve and reject functions:</p>
            <pre><code>const { promise, resolve, reject } = Promise.withResolvers();

// Instead of:
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});</code></pre>
            
            <h2>3. Temporal API (Stage 3)</h2>
            <p>The Temporal API offers a modern replacement for the problematic Date object, providing better handling of dates, times, and time zones.</p>
            
            <h2>4. Decorators</h2>
            <p>Decorators are finally reaching stage 3, providing a clean way to modify classes and class members declaratively.</p>
            
            <p>These features represent a significant step forward in JavaScript's evolution, offering developers more powerful and expressive tools for building modern applications.</p>
        `
    },
    'react-server-components': {
        title: 'React 19 Server Components Deep Dive',
        content: `
            <h1>React 19 Server Components Deep Dive</h1>
            <div class="article-meta">
                <span>Published on December 12, 2024</span> • <span>6 min read</span>
            </div>
            
            <p>React Server Components represent a paradigm shift in how we think about React applications, enabling server-side rendering with unprecedented flexibility and performance.</p>
            
            <h2>What are Server Components?</h2>
            <p>Server Components run on the server during build time or request time, allowing you to read from databases, file systems, or other server-only data sources directly in your components.</p>
            
            <h2>Key Benefits</h2>
            <ul>
                <li>Reduced bundle size</li>
                <li>Direct server resource access</li>
                <li>Improved SEO and initial page load</li>
                <li>Automatic code splitting</li>
            </ul>
            
            <h2>Example Implementation</h2>
            <pre><code>// ServerComponent.js
async function UserProfile({ userId }) {
  const user = await db.user.findUnique({ where: { id: userId } });
  
  return (
    &lt;div&gt;
      &lt;h1&gt;{user.name}&lt;/h1&gt;
      &lt;ClientComponent user={user} /&gt;
    &lt;/div&gt;
  );
}</code></pre>
            
            <p>Server Components are revolutionizing React development by blurring the lines between server and client, creating more efficient and powerful applications.</p>
        `
    },
    'css-container-queries': {
        title: 'CSS Container Queries: The Future of Responsive Design',
        content: `
            <h1>CSS Container Queries: The Future of Responsive Design</h1>
            <div class="article-meta">
                <span>Published on December 10, 2024</span> • <span>4 min read</span>
            </div>
            
            <p>Container queries represent the next evolution in responsive design, allowing components to respond to their container's size rather than the viewport size.</p>
            
            <h2>The Problem with Media Queries</h2>
            <p>Traditional media queries only respond to viewport dimensions, making it difficult to create truly modular, reusable components.</p>
            
            <h2>Container Query Solution</h2>
            <pre><code>.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 300px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}</code></pre>
            
            <h2>Browser Support</h2>
            <p>Container queries are now supported in all modern browsers, making them ready for production use.</p>
            
            <p>This technology opens up new possibilities for component-based design systems and truly responsive components.</p>
        `
    }
};

export const getArticles = async (limit, offset, category, searchTerm) => {
    await delay(500); // Simulate network request

    let articlesToFilter = [...mockArticles];

    if (category && category !== 'all') {
        articlesToFilter = articlesToFilter.filter(article =>
            article.category.toLowerCase() === category || article.tags.some(tag => tag.toLowerCase() === category)
        );
    }

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        articlesToFilter = articlesToFilter.filter(article =>
            article.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            article.excerpt.toLowerCase().includes(lowerCaseSearchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)) ||
            article.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    const totalCount = articlesToFilter.length;
    const paginatedArticles = articlesToFilter.slice(offset, offset + limit);

    return {
        articles: paginatedArticles,
        totalCount: totalCount
    };
};

export const getArticleById = async (id) => {
    await delay(300);
    const article = mockArticles.find(a => a.id === id);
    if (!article) return null;

    // fullArticleContent is now internal to this file
    const content = fullArticleContent[id]?.content || `
        <h1>${article.title}</h1>
        <div class="article-meta">
            <span>Published on ${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • <span>${article.readTime}</span>
        </div>
        <p>${article.excerpt}</p>
        <p>This article is being developed. Check back soon for the full content!</p>
    `;
    return { ...article, fullContent: content };
};

export const addArticle = async (newArticle) => {
    await delay(300);
    const id = `new-article-${mockArticles.length + 1}`;
    const articleWithDefaults = {
        id,
        imageUrl: `https://previews.123rf.com/images/doublebubble/doublebubble1510/doublebubble151000272/46498409-engrave-isolated-panda-bear-illustration-sketch-linear-art.jpg/300x200?text=${newArticle.title.substring(0, 10).replace(/\s/g, '+')}`,
        date: new Date().toISOString().slice(0, 10),
        readTime: '5 min read',
        tags: [],
        featured: false,
        likes: false,
        dislikes: false,
        ...newArticle
    };
    mockArticles.unshift(articleWithDefaults); // Add to the beginning
    return articleWithDefaults;
};

export const updateArticle = async (id, updatedFields) => {
    await delay(300);
    const index = mockArticles.findIndex(article => article.id === id);
    if (index > -1) {
        mockArticles[index] = { ...mockArticles[index], ...updatedFields };
        return mockArticles[index];
    }
    throw new Error('Article not found');
};

export const deleteArticle = async (id) => {
    await delay(300);
    const initialLength = mockArticles.length;
    mockArticles = mockArticles.filter(article => article.id !== id);
    if (mockArticles.length === initialLength) {
        throw new Error('Article not found');
    }
    return { success: true };
};