import React from 'react';

const ProjectHeader = ({ project, isAdmin, isLocked, isLoading, onBack, toggleProjectLock, activeTab, setActiveTab, tabs }) => {
    return (
        <div className="bg-bg-card border border-border rounded-xl shadow-sm p-4 md:p-8">
            <div
                className="flex items-center space-x-2 text-[10px] text-text-muted mb-6 cursor-pointer hover:text-text-primary uppercase tracking-widest font-black transition-colors"
                onClick={onBack}
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Projects</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight truncate">
                            {project.projectName}
                        </h1>
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider shadow-sm ${project.status === 'LIVE' ? 'bg-achievement-muted text-achievement' :
                                project.status === 'DEVELOPMENT' ? 'bg-focus-muted text-focus' :
                                    project.status === 'PLANNING' ? 'bg-xp/10 text-xp border border-xp/20' :
                                        'bg-bg-muted text-text-secondary border border-border'
                            }`}>
                            {project.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-lg text-text-secondary font-bold flex items-center">
                        {project.client?.clientName} | {project.client?.businessName}
                    </p>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => toggleProjectLock(project._id)}
                        disabled={isLoading}
                        className={`w-full md:w-auto px-6 py-3 rounded-xl font-black transition-all flex items-center justify-center space-x-2 border-2 ${isLocked
                                ? 'bg-danger/10 border-danger text-danger hover:bg-danger/20'
                                : 'bg-focus/10 border-focus text-focus hover:bg-focus/20 shadow-lg shadow-focus/10'
                            }`}
                    >
                        {isLocked ? (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span className="uppercase tracking-widest text-xs">Locked</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0z" />
                                </svg>
                                <span className="uppercase tracking-widest text-xs">Unlocked</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto scrollbar-hide space-x-2 mt-8 -mb-4 md:-mb-8 pt-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl transition-all whitespace-nowrap font-bold text-xs uppercase tracking-widest border-b-4 ${activeTab === tab.id
                                ? 'bg-bg-muted border-accent text-accent'
                                : 'border-transparent text-text-muted hover:text-text-primary hover:bg-bg-muted/50'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
                        </svg>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProjectHeader;
