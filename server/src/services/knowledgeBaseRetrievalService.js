const Scheme = require('../models/Scheme');
const { getIsConnected, getMemoryStore } = require('../config/db');
const { seedSchemes } = require('../data/seedData');

/**
 * Knowledge Base Retrieval Service
 * High-reliability keyword & rule-based search engine over verified official government schemes.
 * Isolates search and scoring logic so embedding/vector-based RAG can be plugged in seamlessly.
 */
const searchSchemeKnowledgeBase = async (queryText, userContext = {}) => {
  let allSchemes = [];

  if (getIsConnected()) {
    try {
      allSchemes = await Scheme.find({});
    } catch (err) {
      allSchemes = [...seedSchemes];
    }
  } else {
    const memory = getMemoryStore();
    allSchemes = memory.schemes.length > 0 ? memory.schemes : [...seedSchemes];
  }

  const queryLower = queryText.toLowerCase();

  // Keyword & topic matching engine
  const scoredSchemes = allSchemes.map(scheme => {
    let score = 0;
    const textToMatch = `${scheme.name} ${scheme.hindiName || ''} ${scheme.sector} ${scheme.description} ${scheme.purpose} ${scheme.targetBeneficiaries} ${(scheme.eligibility.occupation || []).join(' ')}`.toLowerCase();

    // Key topic rules
    if (queryLower.includes('kisan') || queryLower.includes('farmer') || queryLower.includes('kheti') || queryLower.includes('krishi') || queryLower.includes('land')) {
      if (scheme.sector === 'Agriculture' || scheme.schemeId === 'SCH-001') score += 10;
    }
    if (queryLower.includes('swasthya') || queryLower.includes('health') || queryLower.includes('hospital') || queryLower.includes('ill') || queryLower.includes('beemar') || queryLower.includes('elaj')) {
      if (scheme.sector === 'Healthcare' || scheme.schemeId === 'SCH-002') score += 10;
    }
    if (queryLower.includes('ghar') || queryLower.includes('house') || queryLower.includes('awas') || queryLower.includes('makaan') || queryLower.includes('housing')) {
      if (scheme.sector === 'Housing' || scheme.schemeId === 'SCH-003') score += 10;
    }
    if (queryLower.includes('scholarship') || queryLower.includes('padhai') || queryLower.includes('student') || queryLower.includes('school') || queryLower.includes('college') || queryLower.includes('education')) {
      if (scheme.sector === 'Education' || scheme.schemeId === 'SCH-004') score += 10;
    }
    if (queryLower.includes('vendor') || queryLower.includes('dukan') || queryLower.includes('rehari') || queryLower.includes('loan') || queryLower.includes('business') || queryLower.includes('rozgar')) {
      if (scheme.sector === 'Employment & Business' || scheme.schemeId === 'SCH-005') score += 10;
    }
    if (queryLower.includes('beti') || queryLower.includes('girl') || queryLower.includes('sukanya') || queryLower.includes('daughter') || queryLower.includes('child')) {
      if (scheme.sector === 'Women & Child Welfare' || scheme.schemeId === 'SCH-006') score += 10;
    }
    if (queryLower.includes('pension') || queryLower.includes('budaapa') || queryLower.includes('senior') || queryLower.includes('old age') || queryLower.includes('elderly')) {
      if (scheme.sector === 'Senior Citizens & Social Welfare' || scheme.schemeId === 'SCH-007') score += 10;
    }

    // Token overlap scoring
    const tokens = queryLower.split(/\s+/).filter(t => t.length > 2);
    tokens.forEach(token => {
      if (textToMatch.includes(token)) score += 2;
    });

    // Scheme-specific preliminary eligibility evaluation
    let eligibilityBadge = "🟡 More information needed";
    let eligibilityMatchScore = 0;
    let explanation = "Based on official parameters for " + scheme.name + ".";

    if (userContext.occupation) {
      const matchOcc = scheme.eligibility.occupation.some(occ =>
        occ.toLowerCase() === userContext.occupation.toLowerCase() || occ === 'All'
      );
      if (matchOcc) {
        eligibilityMatchScore += 1;
        explanation = `Matches your stated occupation (${userContext.occupation}).`;
      }
    }
    if (userContext.income && scheme.eligibility.maxIncome) {
      if (Number(userContext.income) <= scheme.eligibility.maxIncome) {
        eligibilityMatchScore += 1;
        explanation += ` Stated income is within the limit (₹${scheme.eligibility.maxIncome.toLocaleString('en-IN')}).`;
      }
    }
    if (userContext.age && scheme.eligibility.minAge && scheme.eligibility.maxAge) {
      const ageNum = Number(userContext.age);
      if (ageNum >= scheme.eligibility.minAge && ageNum <= scheme.eligibility.maxAge) {
        eligibilityMatchScore += 1;
        explanation += ` Age (${ageNum} yrs) meets scheme criteria.`;
      }
    }

    if (eligibilityMatchScore >= 2) {
      eligibilityBadge = "🟢 Likely eligible";
    } else if (eligibilityMatchScore === 1 || (!userContext.occupation && !userContext.income)) {
      eligibilityBadge = "🟡 More information needed";
    }

    return {
      scheme,
      score,
      eligibilityBadge,
      explanation,
      citationSource: `${scheme.officialUrl} (${scheme.sourceMetadata})`
    };
  });

  const topMatches = scoredSchemes
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (topMatches.length === 0) {
    return {
      found: false,
      schemes: allSchemes.slice(0, 2).map(s => ({
        scheme: s,
        eligibilityBadge: "🟡 More information needed",
        explanation: "General official scheme match.",
        citationSource: `${s.officialUrl} (${s.sourceMetadata})`
      })),
      note: "I couldn't find verified information matching that exact query in our database — here are closely related government schemes you may check."
    };
  }

  return {
    found: true,
    schemes: topMatches,
    note: null
  };
};

module.exports = { searchSchemeKnowledgeBase };
