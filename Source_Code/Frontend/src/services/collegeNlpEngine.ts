import { KNOWLEDGE_BASE, CATEGORIES, DetailedTopicItem, SUGGESTED_QUICK_CHIPS } from '../data/collegeData';
import { CollegeCategoryKey, Message } from '../types';

// Stopwords list for standard NLP processing
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d',
  'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'please', 'tell', 'want', 'know', 'give', 'detail', 'details'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

interface DocumentModel {
  item: DetailedTopicItem;
  terms: Map<string, number>;
  vector: Map<string, number>;
  magnitude: number;
}

class CollegeTfIdfEngine {
  private vocabulary: Set<string> = new Set();
  private idfMap: Map<string, number> = new Map();
  private docModels: DocumentModel[] = [];

  constructor() {
    this.train();
  }

  public train() {
    this.vocabulary.clear();
    this.idfMap.clear();
    this.docModels = [];

    const totalDocs = KNOWLEDGE_BASE.length;
    const docTermFreqs: Map<string, number>[] = [];

    // Step 1: Collect terms for each document
    for (const item of KNOWLEDGE_BASE) {
      const docText = `${item.category} ${item.keywords.join(' ')} ${item.patterns.join(' ')} ${item.responseTitle} ${item.suggestedFollowUps.join(' ')}`;
      const tokens = tokenize(docText);
      const termMap = new Map<string, number>();

      for (const token of tokens) {
        termMap.set(token, (termMap.get(token) || 0) + 1);
        this.vocabulary.add(token);
      }

      // Add extra weight for category title and direct keywords
      for (const kw of item.keywords) {
        const kwTokens = tokenize(kw);
        for (const kt of kwTokens) {
          termMap.set(kt, (termMap.get(kt) || 0) + 3);
          this.vocabulary.add(kt);
        }
      }

      docTermFreqs.push(termMap);
    }

    // Step 2: Calculate IDF for each word in vocabulary
    for (const term of this.vocabulary) {
      let docsWithTerm = 0;
      for (const docMap of docTermFreqs) {
        if (docMap.has(term)) {
          docsWithTerm++;
        }
      }
      // Standard smoothed IDF formula
      const idf = Math.log((totalDocs + 1) / (docsWithTerm + 1)) + 1;
      this.idfMap.set(term, idf);
    }

    // Step 3: Compute TF-IDF vectors for documents
    for (let i = 0; i < totalDocs; i++) {
      const item = KNOWLEDGE_BASE[i];
      const termFreqs = docTermFreqs[i];
      const vector = new Map<string, number>();
      let sumSquares = 0;

      for (const [term, freq] of termFreqs.entries()) {
        const idf = this.idfMap.get(term) || 1;
        const tfIdf = (1 + Math.log(freq)) * idf;
        vector.set(term, tfIdf);
        sumSquares += tfIdf * tfIdf;
      }

      const magnitude = Math.sqrt(sumSquares) || 1;

      this.docModels.push({
        item,
        terms: termFreqs,
        vector,
        magnitude,
      });
    }
  }

  public query(userInput: string): {
  bestMatch: DetailedTopicItem | null;
  responseText?: string;
  category: CollegeCategoryKey;
    confidence: number;
    score: number;
    relatedQuestions: string[];
  } {
    const rawTokens = tokenize(userInput);
    const cleanInput = userInput.trim().toLowerCase();

// Casual conversation
if (
  cleanInput === 'how are you' ||
  cleanInput === 'how are u' ||
  cleanInput === 'how r you' ||
  cleanInput === 'how r u'
) {
  return {
    bestMatch: null,
    responseText:
      "I'm doing great! 😊 Thanks for asking! I'm here to help you with anything related to Galgotias University.",
    category: 'admissions',
    confidence: 0.99,
    score: 0.99,
    relatedQuestions: [
      'What courses are offered?',
      'What are the fees?',
      'What are the eligibility criteria?',
    ],
  };
}

if (
  cleanInput === 'hello' ||
  cleanInput === 'hi' ||
  cleanInput === 'hey' ||
  cleanInput === 'hii' ||
  cleanInput === 'helo'
) {
  return {
    bestMatch: null,
    responseText:
      "Hello! 👋 Welcome to the Galgotias University Enquiry Assistant. How can I help you today?",
    category: 'admissions',
    confidence: 0.99,
    score: 0.99,
    relatedQuestions: [
      'What courses are offered?',
      'What are the fees?',
      'What are the eligibility criteria?',
      'What scholarships are available?',
    ],
  };
}

    // Fast-path 1: Direct Category Matching
    for (const cat of CATEGORIES) {
      if (cleanInput === cat.key || cleanInput === cat.title.toLowerCase()) {
        const matchingDoc = this.docModels.find(d => d.item.category === cat.key);
        if (matchingDoc) {
          return {
            bestMatch: matchingDoc.item,
            category: cat.key,
            confidence: 0.98,
            score: 0.98,
            relatedQuestions: cat.sampleQuestions,
          };
        }
      }
    }

    // Fast-path 2: Direct pattern exact/substring matching
    for (const doc of this.docModels) {
      for (const pat of doc.item.patterns) {
        const p = pat.toLowerCase();
        if (cleanInput === p || cleanInput.includes(p) || p.includes(cleanInput)) {
          return {
            bestMatch: doc.item,
            category: doc.item.category as CollegeCategoryKey,
            confidence: 0.95,
            score: 0.95,
            relatedQuestions: doc.item.suggestedFollowUps,
          };
        }
      }
    }

    if (rawTokens.length === 0) {
      return {
        bestMatch: null,
        category: 'admissions',
        confidence: 0,
        score: 0,
        relatedQuestions: SUGGESTED_QUICK_CHIPS.slice(0, 4),
      };
    }

    // Build Query TF-IDF Vector
    const queryTermMap = new Map<string, number>();
    for (const token of rawTokens) {
      queryTermMap.set(token, (queryTermMap.get(token) || 0) + 1);
    }

    const queryVector = new Map<string, number>();
    let querySumSquares = 0;

    for (const [term, freq] of queryTermMap.entries()) {
      const idf = this.idfMap.get(term) || (1 + Math.log(this.docModels.length + 1));
      const tfIdf = (1 + Math.log(freq)) * idf;
      queryVector.set(term, tfIdf);
      querySumSquares += tfIdf * tfIdf;
    }

    const queryMagnitude = Math.sqrt(querySumSquares) || 1;

    // Calculate Cosine Similarity with all documents
    let bestScore = -1;
    let bestDoc: DocumentModel | null = null;

    for (const doc of this.docModels) {
      let dotProduct = 0;

      for (const [term, qWeight] of queryVector.entries()) {
        const docWeight = doc.vector.get(term);
        if (docWeight) {
          dotProduct += qWeight * docWeight;
        }
      }

      // Keyword direct hit booster
      let keywordHits = 0;
      for (const kw of doc.item.keywords) {
        if (cleanInput.includes(kw.toLowerCase())) {
          keywordHits++;
        }
      }

      const baseCosine = dotProduct / (queryMagnitude * doc.magnitude);
      const finalScore = baseCosine + (keywordHits * 0.15);

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestDoc = doc;
      }
    }

    // Normalizing confidence score between 0.0 and 1.0
    const confidence = Math.min(1.0, Math.max(0.1, Number((bestScore * 1.1).toFixed(2))));

    if (bestDoc && confidence > 0.25) {
      return {
        bestMatch: bestDoc.item,
        category: bestDoc.item.category as CollegeCategoryKey,
        confidence,
        score: bestScore,
        relatedQuestions: bestDoc.item.suggestedFollowUps,
      };
    }

    // Fallback if confidence is low
    return {
      bestMatch: null,
      category: 'admissions',
      confidence: confidence < 0.25 ? 0.18 : confidence,
      score: bestScore,
      relatedQuestions: [
        'What courses are offered?',
        'What are the fees?',
        'What are the eligibility criteria?',
        'What scholarships are available?',
      ],
    };
  }

  public getCategoryOverview(categoryKey: CollegeCategoryKey): {
    title: string;
    text: string;
    relatedQuestions: string[];
  } {
    const doc = this.docModels.find(d => d.item.category === categoryKey);
    const cat = CATEGORIES.find(c => c.key === categoryKey);

    if (doc) {
      return {
        title: doc.item.responseTitle,
        text: doc.item.responseText,
        relatedQuestions: doc.item.suggestedFollowUps,
      };
    }

    return {
      title: `${cat?.title || 'College'} Enquiry`,
      text: cat?.description || 'Here is the relevant information for this department.',
      relatedQuestions: cat?.sampleQuestions || SUGGESTED_QUICK_CHIPS.slice(0, 4),
    };
  }
}

export const nlpEngine = new CollegeTfIdfEngine();
