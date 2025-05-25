const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
});

// Function to get destination-specific images
const getDestinationImages = (country) => {
  // Common tourism destinations with specific images
  const destinationImages = {
    japan: [
      'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=2071&auto=format&fit=crop',
    ],
    france: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80&w=2073&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2073&auto=format&fit=crop',
    ],
    italy: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2083&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533165023360-abed578ae1c9?q=80&w=2036&auto=format&fit=crop',
    ],
    spain: [
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop',
    ],
    greece: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2074&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2072&auto=format&fit=crop',
    ],
    usa: [
      'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=2099&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606920301350-7ce0ca19bf2b?q=80&w=2070&auto=format&fit=crop',
    ],
    'united kingdom': [
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488747279002-c8523379faaa?q=80&w=2070&auto=format&fit=crop',
    ],
    china: [
      'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517309230475-6736d926b979?q=80&w=2070&auto=format&fit=crop',
    ],
    australia: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586317225337-86a05b73d99e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=2033&auto=format&fit=crop',
    ],
    india: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=2065&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop',
    ],
    thailand: [
      'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop',
    ],
    brazil: [
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=2259&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526139242228-6320fcaace7e?q=80&w=2070&auto=format&fit=crop',
    ],
  };

  // Fallback images for destinations not in our mapping
  const fallbackImages = [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2035&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2074&auto=format&fit=crop',
  ];

  // Convert country to lowercase for case-insensitive matching
  const countryLower = country.toLowerCase();

  // Find specific country images or fall back to general travel images
  const countryImages = destinationImages[countryLower] || fallbackImages;

  // Return a random image from the collection
  const randomIndex = Math.floor(Math.random() * countryImages.length);
  return countryImages[randomIndex];
};

/**
 * Generate a travel itinerary using OpenAI
 * @param {string} country - The country for the itinerary
 * @param {number} days - Number of days for the itinerary
 * @returns {Object} Generated itinerary
 */
async function generateItineraryWithAI(country, days) {
  try {
    // Prepare the prompt for OpenAI
    const prompt = `
      Create a detailed ${days}-day travel itinerary for ${country}. 
      Include the following in your response as a JSON object:
      
      1. A creative title for this itinerary
      2. A short description of the overall experience
      3. Estimated cost in USD (a realistic number as an integer, no $ symbol or commas)
      4. Start point (e.g., airport name or main city)
      5. End point (typically same as start point)
      6. Best for (e.g., "Solo travelers", "Families", "Couples")
      7. A detailed daily plan with:
         - Title for each day
         - Description for each day
         - 3-5 activities for each day, including time and description
      8. A list of 5-8 items to pack (as array of strings)
      9. Additional tips for travelers (as plain text)
      
      Format as a valid JSON object with these fields exactly matching the names I provide.
    `;

    // Call OpenAI API
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a travel expert who creates detailed, realistic travel itineraries that exactly match the schema required.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    // Parse the response
    const itineraryData = JSON.parse(response.choices[0].message.content);

    // Get a country-specific image
    const countryImage = getDestinationImages(country);

    // Format the response to match Supabase table schema
    const data = {
      title: itineraryData.title || `${days} Days in ${country}`,
      destination: itineraryData.destination || country,
      country: country,
      duration: parseInt(days),
      description:
        itineraryData.description ||
        `Explore the beauty of ${country} in ${days} days.`,
      image_url: countryImage,
      estimated_cost: parseInt(itineraryData.estimatedCost || 1500),
      start_point:
        itineraryData.startPoint || `${country} International Airport`,
      end_point: itineraryData.endPoint || `${country} International Airport`,
      best_for: itineraryData.bestFor || 'Everyone',
      rating: 4.5,
      review_count: 0,
      is_favorite: false,
      daily_plan: itineraryData.dailyPlan
        ? JSON.stringify(itineraryData.dailyPlan)
        : JSON.stringify([]),
      packing_list: itineraryData.packingList || [],
      additional_tips:
        itineraryData.additionalTips || `Tips for traveling to ${country}`,
      images: [countryImage],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log({ data });
    return data;
  } catch (error) {
    console.error('Error generating itinerary with AI:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
}

module.exports = {
  generateItineraryWithAI,
};
