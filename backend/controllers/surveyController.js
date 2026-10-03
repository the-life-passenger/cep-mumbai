import { SurveysRepo } from '../data/repo.js';

export async function createSurvey(req, res, next) {
  try {
    const {
      name,
      locality,
      ageGroup,
      serviceAccessProblem,
      servicesAvailableNearby,
      problemsFindingInfo,
      accessibilityProblem,
      suggestions,
      comments
    } = req.body;

    if (!locality || !ageGroup || !serviceAccessProblem) {
      return res.status(400).json({
        message: 'Locality, Age Group, and Difficult Service to Access are required'
      });
    }

    const newResponse = await SurveysRepo.create({
      name: name ? name.trim() : 'Anonymous Resident',
      locality: locality.trim(),
      ageGroup,
      serviceAccessProblem,
      servicesAvailableNearby: Array.isArray(servicesAvailableNearby) ? servicesAvailableNearby.join(', ') : (servicesAvailableNearby || ''),
      problemsFindingInfo: problemsFindingInfo || '',
      accessibilityProblem: accessibilityProblem || '',
      suggestions: suggestions || '',
      comments: comments || ''
    });

    res.status(201).json({
      message: 'Thank you for contributing to your community survey!',
      data: newResponse
    });
  } catch (err) {
    next(err);
  }
}

export async function getSurveys(req, res, next) {
  try {
    const { search, locality, problem } = req.query;
    let surveys = await SurveysRepo.getAll();

    if (locality && locality !== 'all') {
      surveys = surveys.filter(s => s.locality.toLowerCase().includes(locality.toLowerCase()));
    }

    if (problem && problem !== 'all') {
      surveys = surveys.filter(s => s.serviceAccessProblem.toLowerCase() === problem.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      surveys = surveys.filter(s =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.locality && s.locality.toLowerCase().includes(q)) ||
        (s.serviceAccessProblem && s.serviceAccessProblem.toLowerCase().includes(q)) ||
        (s.suggestions && s.suggestions.toLowerCase().includes(q)) ||
        (s.comments && s.comments.toLowerCase().includes(q))
      );
    }

    res.json(surveys);
  } catch (err) {
    next(err);
  }
}

export async function deleteSurvey(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await SurveysRepo.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Survey response not found' });
    }
    res.json({ message: 'Survey response deleted successfully', id });
  } catch (err) {
    next(err);
  }
}

export async function getSurveyStats(req, res, next) {
  try {
    const surveys = await SurveysRepo.getAll();
    const totalResponses = surveys.length;

    // Problems distribution
    const problemMap = {};
    surveys.forEach(s => {
      const p = s.serviceAccessProblem || 'Other';
      problemMap[p] = (problemMap[p] || 0) + 1;
    });
    const problemStats = Object.entries(problemMap).map(([name, count]) => ({
      name,
      count,
      percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Age distribution
    const ageMap = {};
    surveys.forEach(s => {
      const a = s.ageGroup || 'Unspecified';
      ageMap[a] = (ageMap[a] || 0) + 1;
    });
    const ageStats = Object.entries(ageMap).map(([name, count]) => ({
      name,
      count
    }));

    // Locality distribution
    const localityMap = {};
    surveys.forEach(s => {
      const loc = (s.locality || 'Unknown').split(',')[0].trim();
      localityMap[loc] = (localityMap[loc] || 0) + 1;
    });
    const localityStats = Object.entries(localityMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    res.json({
      totalResponses,
      problemStats,
      ageStats,
      localityStats
    });
  } catch (err) {
    next(err);
  }
}
