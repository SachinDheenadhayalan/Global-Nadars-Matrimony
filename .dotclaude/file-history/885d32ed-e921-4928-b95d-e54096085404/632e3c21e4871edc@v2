export default function GalleryPage() {
  const galleryImages = [
    { id: 1, title: 'Wedding Ceremony 1', category: 'Weddings' },
    { id: 2, title: 'Success Story 1', category: 'Success Stories' },
    { id: 3, title: 'Engagement 1', category: 'Engagements' },
    { id: 4, title: 'Wedding Ceremony 2', category: 'Weddings' },
    { id: 5, title: 'Success Story 2', category: 'Success Stories' },
    { id: 6, title: 'Engagement 2', category: 'Engagements' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="glass-card p-12">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Gallery</h1>
        <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
          Celebrating love stories and successful matches from our community
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image) => (
            <div key={image.id} className="glass-card overflow-hidden group">
              <div className="aspect-video bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
                <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{image.title}</h3>
                <p className="text-sm text-gray-400">{image.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300 text-lg">
            More photos coming soon! Check back later for more success stories.
          </p>
        </div>
      </div>
    </div>
  );
}
