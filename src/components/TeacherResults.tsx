import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Download, Save } from 'lucide-react';
import { AnalysisResult, ExperimentSection } from '@/types';

interface TeacherResultsProps {
  results: AnalysisResult[];
  sections: ExperimentSection[];
  sessionName?: string;
  onSave: () => void;
  onExport: () => void;
}

const getQualityIcon = (quality?: string) => {
  if (quality === 'good') return <CheckCircle className="text-green-600" size={20} />;
  if (quality === 'needs improvement') return <AlertTriangle className="text-yellow-600" size={20} />;
  return <XCircle className="text-red-600" size={20} />;
};

const getQualityColor = (quality?: string) => {
  if (quality === 'good') return 'bg-green-50 border-green-300';
  if (quality === 'needs improvement') return 'bg-yellow-50 border-yellow-300';
  return 'bg-red-50 border-red-300';
};

const getQualityLabel = (quality?: string) => {
  if (quality === 'good') return 'Gott';
  if (quality === 'needs improvement') return 'Þarf að bæta';
  if (quality === 'unsatisfactory') return 'Ófullnægjandi';
  return 'N/A';
};

export const TeacherResults: React.FC<TeacherResultsProps> = ({
  results,
  sections,
  sessionName,
  onSave,
  onExport,
}) => {
  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Niðurstöður
          {sessionName && <span className="text-lg text-slate-600 ml-3">- {sessionName}</span>}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <Save size={20} />
            Vista greiningu
          </button>
          <button
            onClick={onExport}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Download size={20} />
            Niðurhala CSV
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {results.map((result, idx) => (
          <div key={idx} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-slate-800">{result.filename}</h3>
              {result.suggestedGrade && (
                <div className="text-right">
                  <div className="text-sm text-slate-600">Tillaga að einkunn:</div>
                  <div className="text-2xl font-bold text-indigo-900">{result.suggestedGrade}</div>
                </div>
              )}
            </div>

            {result.error ? (
              <div className="bg-red-50 border border-red-300 rounded p-4 text-red-800">
                Villa: {result.error}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {sections.map((section) => {
                  const data = result.sections?.[section.id];
                  if (!data) return null;

                  return (
                    <div
                      key={section.id}
                      className={`border rounded-lg p-4 ${
                        data.present ? getQualityColor(data.quality) : 'bg-slate-50 border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {data.present ? (
                          getQualityIcon(data.quality)
                        ) : (
                          <XCircle className="text-slate-400" size={20} />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{section.name}</h4>
                          <div className="text-sm">
                            {data.present ? (
                              <>
                                <span className="font-medium">{getQualityLabel(data.quality)}</span>
                                {data.note && <div className="text-slate-600 mt-1">{data.note}</div>}
                              </>
                            ) : (
                              <span className="text-slate-600">Vantar</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
