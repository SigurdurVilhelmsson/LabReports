import React from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 text-center">
            Kennslutól - Skýrslumat
          </h1>
          <p className="text-slate-600 text-center mb-8">
            AI-aðstoð við mat og skrif efnafræðiskýrslna
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Teacher Mode */}
            <button
              onClick={() => navigate('/teacher')}
              className="group bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-2 border-indigo-300 rounded-lg p-8 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap size={48} />
                </div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">Kennari</h2>
                <p className="text-slate-700 mb-4">
                  Hraðmat á mörgum skýrslum samtímis
                </p>
                <ul className="text-sm text-slate-600 space-y-1 text-left">
                  <li>• Greiningar á mörgum skýrslum í einu</li>
                  <li>• Flytja út niðurstöður í CSV</li>
                  <li>• Vista greiningarlotur</li>
                  <li>• Skoða fyrri greiningar</li>
                </ul>
              </div>
            </button>

            {/* Student Mode */}
            <button
              onClick={() => navigate('/student')}
              className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-300 rounded-lg p-8 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-600 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen size={48} />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">Nemandi</h2>
                <p className="text-slate-700 mb-4">
                  Fáðu ítarlega endurgjöf á skýrsluna þína
                </p>
                <ul className="text-sm text-slate-600 space-y-1 text-left">
                  <li>• Skoða vinnuseðil fyrir tilraunina</li>
                  <li>• Fá ítarlega endurgjöf með stigum</li>
                  <li>• Læra af tillögum og athugasemdum</li>
                  <li>• Senda inn aftur til að bæta</li>
                </ul>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Veldu hlutverk til að halda áfram</p>
          </div>
        </div>
      </div>
    </div>
  );
};
