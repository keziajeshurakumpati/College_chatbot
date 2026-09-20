import { AppSettings, CollegeCategoryKey, Message } from '../types';
import { nlpEngine } from './collegeNlpEngine';
import { COLLEGE_INFO } from '../data/collegeData';

export interface ChatResponsePayload {
  text: string;
  category: CollegeCategoryKey;
  confidence: number;
  relatedQuestions: string[];
  actionData?: any;
  backendUsed: 'local_nlp' | 'custom_api';
}

export async function processCollegeQuery(
  userInput: string,
  settings: AppSettings,
  sessionHistory?: Message[]
): Promise<ChatResponsePayload> {

  // ======================================
  // PYTHON BACKEND
  // ======================================

  if (
    settings.backendMode === 'custom_api' &&
    settings.customApiUrl
  ) {

    try {

      console.log(
        'Sending question to Python backend:',
        userInput
      );

      const response = await fetch(
        settings.customApiUrl,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',

            ...(settings.apiAuthToken
              ? {
                  Authorization:
                    `Bearer ${settings.apiAuthToken}`,
                }
              : {}),
          },

          body: JSON.stringify({
            question: userInput,

            history: sessionHistory
              ? sessionHistory
                  .slice(-6)
                  .map(message => ({
                    sender: message.sender,
                    text: message.text,
                  }))
              : [],

            college_id: 'galgotias_university',
          }),
        }
      );


      // ======================================
      // CHECK HTTP RESPONSE
      // ======================================

      if (!response.ok) {

        console.error(
          `Python backend returned HTTP ${response.status}`
        );

        throw new Error(
          `Backend returned HTTP ${response.status}`
        );
      }


      // ======================================
      // GET BACKEND DATA
      // ======================================

      const data = await response.json();

      console.log(
        'FULL PYTHON BACKEND RESPONSE:',
        data
      );


      // ======================================
      // EXTRACT ACTUAL ANSWER
      // ======================================

      const backendText =
        data.response ||
        data.answer ||
        data.reply ||
        data.text ||
        data.message ||
        data.responseText ||
        data.generated_response ||
        data.generatedText ||

        // Nested response support
        data.data?.response ||
        data.data?.answer ||
        data.data?.reply ||
        data.data?.text ||
        data.data?.message ||

        data.result?.response ||
        data.result?.answer ||
        data.result?.reply ||
        data.result?.text ||

        data.output?.response ||
        data.output?.answer ||
        data.output?.text ||

        null;


      // ======================================
      // VALIDATE BACKEND RESPONSE
      // ======================================

      if (
        backendText &&
        typeof backendText === 'string' &&
        backendText.trim().length > 0
      ) {

        console.log(
          'ACTUAL ANSWER RECEIVED:',
          backendText
        );

        console.log(
          'SOURCE:',
          data.source || data.backend || 'Python Backend'
        );


        return {

          text: backendText.trim(),

          category:
            (
              data.category ||
              data.intent ||
              data.predicted_intent ||
              'admissions'
            ) as CollegeCategoryKey,

          confidence:
            typeof data.confidence === 'number'
              ? data.confidence
              : typeof data.score === 'number'
                ? data.score
                : 0.9,

          relatedQuestions:
            Array.isArray(data.related_questions)
              ? data.related_questions

              : Array.isArray(data.relatedQuestions)
                ? data.relatedQuestions

                : Array.isArray(data.suggestions)
                  ? data.suggestions

                  : [],

          actionData:

            data.table_data

              ? {
                  type: 'table',
                  data: data.table_data,
                }

              : data.tableData

                ? {
                    type: 'table',
                    data: data.tableData,
                  }

                : undefined,

          backendUsed: 'custom_api',
        };
      }


      // ======================================
      // BACKEND RETURNED NO ANSWER
      // ======================================

      console.error(
        'BACKEND RESPONSE HAS NO VALID ANSWER:',
        data
      );


      throw new Error(
        'Backend returned JSON but no answer field was found.'
      );


    } catch (error) {

      console.error(
        'PYTHON BACKEND ERROR:',
        error
      );

    }
  }


  // ======================================
  // LOCAL TF-IDF ENGINE
  // ======================================

  if (settings.simulatedDelayMs > 0) {

    await new Promise(resolve =>
      setTimeout(
        resolve,
        settings.simulatedDelayMs
      )
    );
  }


  const result =
    nlpEngine.query(userInput);


  // ======================================
  // DIRECT RESPONSE
  // ======================================

  if (result.responseText) {

    return {

      text:
        result.responseText,

      category:
        result.category,

      confidence:
        result.confidence,

      relatedQuestions:
        result.relatedQuestions,

      backendUsed:
        'local_nlp',
    };
  }


  // ======================================
  // BEST MATCH
  // ======================================

  if (result.bestMatch) {

    return {

      text:
        result.bestMatch.responseText,

      category:
        result.category,

      confidence:
        result.confidence,

      relatedQuestions:
        result.relatedQuestions,

      actionData:

        result.bestMatch.tableData

          ? {
              type: 'table',

              title:
                'Summary Information',

              data:
                result.bestMatch.tableData,
            }

          : undefined,

      backendUsed:
        'local_nlp',
    };
  }


  // ======================================
  // FALLBACK
  // ======================================

  const fallbackGreeting = `
I couldn't find a high-confidence match for:

"${userInput}"

As the ${COLLEGE_INFO.shortName} Enquiry Assistant, I can help with:

🎓 Admissions
📚 Courses
💰 Fees & Scholarships
🏠 Hostel
💼 Placements
📝 Examinations
`;


  return {

    text:
      fallbackGreeting,

    category:
      'admissions',

    confidence:
      result.confidence,

    relatedQuestions: [
      'What courses are offered?',
      'What are the eligibility criteria?',
      'What are the fees?',
      'What scholarships are available?',
    ],

    backendUsed:
      'local_nlp',
  };
}


// ======================================
// TEST PYTHON API CONNECTION
// ======================================

export async function pingCustomApi(
  url: string,
  token?: string
): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> {

  const start =
    performance.now();


  try {

    const response =
      await fetch(
        url,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },

          body:
            JSON.stringify({
              question:
                'ping_health_check',
            }),
        }
      );


    const latency =
      Math.round(
        performance.now() - start
      );


    if (response.ok) {

      return {

        success:
          true,

        message:
          `Connected successfully (${latency}ms latency).`,

        latencyMs:
          latency,
      };
    }


    return {

      success:
        false,

      message:
        `Server responded with HTTP ${response.status}`,
    };


  } catch (error: any) {

    return {

      success:
        false,

      message:
        `Connection error: ${
          error?.message ||
          'Cannot reach backend'
        }`,
    };
  }
}