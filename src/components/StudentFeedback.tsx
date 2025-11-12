import React from 'react';
import { CheckCircle, XCircle, Lightbulb, TrendingUp, Target } from 'lucide-react';
import { StudentFeedback as StudentFeedbackType, ExperimentSection } from '@/types';

interface StudentFeedbackProps {
  feedback: StudentFeedbackType[];
  sections: ExperimentSection[];
}

export const StudentFeedback: React.FC<StudentFeedbackProps> = ({ feedback, sections }) => {
  if (feedback.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Endurgjöf á skýrsluna þína</h2>

      <div className="space-y-8">
        {feedback.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{item.filename}</h3>

            {/* Overall Assessment */}
            {item.overallAssessment && (
              <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                  <Target size={20} />
                  Heildarmat
                </h4>
                <p className="text-slate-700">{item.overallAssessment}</p>
              </div>
            )}

            {/* Section Feedback */}
            <div className="space-y-4 mb-6">
              {sections.map((section) => {
                const sectionData = item.sections[section.id];
                if (!sectionData) return null;

                return (
                  <div
                    key={section.id}
                    className={`border rounded-lg p-4 ${
                      sectionData.present ? 'bg-slate-50 border-slate-300' : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {sectionData.present ? (
                        <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                      ) : (
                        <XCircle className="text-red-600 flex-shrink-0" size={20} />
                      )}
                      <h4 className="font-semibold text-slate-800">{section.name}</h4>
                    </div>

                    {sectionData.present ? (
                      <div className="ml-8 space-y-3">
                        {/* Strengths */}
                        {sectionData.strengths && sectionData.strengths.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-1">
                              <CheckCircle size={16} />
                              Vel gert:
                            </div>
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                              {sectionData.strengths.map((strength, i) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Improvements */}
                        {sectionData.improvements && sectionData.improvements.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-yellow-700 mb-1 flex items-center gap-1">
                              <TrendingUp size={16} />
                              Mætti bæta:
                            </div>
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                              {sectionData.improvements.map((improvement, i) => (
                                <li key={i}>{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggestions */}
                        {sectionData.suggestions && sectionData.suggestions.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                              <Lightbulb size={16} />
                              Tillögur:
                            </div>
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                              {sectionData.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="ml-8 text-sm text-red-700">
                        Þessi hluti vantar í skýrsluna. {section.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next Steps */}
            {item.nextSteps && item.nextSteps.length > 0 && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Target size={20} />
                  Næstu skref
                </h4>
                <ul className="list-decimal list-inside text-sm text-slate-700 space-y-1">
                  {item.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
