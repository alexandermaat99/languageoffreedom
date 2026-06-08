import { Card } from "@/components/ui/card";
import { BOOK_SHORT_TITLE } from "@/lib/site-brand";

export function Foreword() {
  return (
    <section id="foreword" className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Foreword
            </h2>
            <p className="text-lg text-gray-600 mb-4">by Raymond Aaron</p>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              I first met <strong>Samly Maat</strong> at my 10-10-10 program, and from the moment she spoke, I felt the quiet strength in her voice. It was steady, grounded, and unmistakably true. She was not simply writing a book. She was learning how to claim her voice. That same spirit lives in every page of <strong>{BOOK_SHORT_TITLE}</strong>.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              This third memoir marks a powerful and deeply human turning point in Samly&apos;s journey. If her earlier books revealed the trauma of survival and the ache of displacement, this one shows the slow and courageous work of belonging. Here, you meet a young refugee girl navigating America without the language to explain herself, without the cultural map to guide her, and often without safety even at home. Through school hallways, family conflict, and quiet moments of fear, she begins to discover something essential. Her voice matters.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Samly writes with rare honesty and restraint. She does not soften the pain of being misunderstood, silenced, or forced to grow up too soon. Yet she also shows you how kindness, education, and faith can become lifelines. This book reveals how language becomes more than words. It becomes freedom. Freedom to speak. Freedom to choose. Freedom to imagine a future beyond survival.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              I have worked with many authors, but few write with Samly&apos;s clarity, humility, and emotional truth. She does not ask for sympathy. She invites understanding. And in doing so, she reminds you that resilience is not loud. It is built quietly, one brave moment at a time.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              May <strong>{BOOK_SHORT_TITLE}</strong> remind you that belonging is learned, courage is practiced, and your voice, no matter how fragile it may be now, can grow strong enough to change your life.
            </p>

            <div className="text-right border-t border-gray-200 pt-6">
              <p className="text-xl font-bold text-gray-900 mb-1">— Raymond Aaron</p>
              <p className="text-lg text-green-600 font-semibold">New York Times Bestselling Author</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

