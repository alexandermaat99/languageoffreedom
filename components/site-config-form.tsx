'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { normalizePreorderDiscount } from '@/lib/preorder-discount';

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
] as const;

interface SiteConfig {
  id: string;
  config_key: string;
  config_value: any;
  description: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SiteConfigFormProps {
  config: SiteConfig;
  onSave: (key: string, value: any, description?: string) => Promise<void>;
  onCancel: () => void;
}

export function SiteConfigForm({ config, onSave, onCancel }: SiteConfigFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Helper function to convert object with numeric keys to array
  const objectToArray = (obj: any): any[] => {
    if (Array.isArray(obj)) {
      return obj;
    }
    if (obj && typeof obj === 'object') {
      // Check if it's an object with numeric string keys (like {"0": {...}, "1": {...}})
      const keys = Object.keys(obj);
      const allNumericKeys = keys.every(key => /^\d+$/.test(key));
      if (allNumericKeys && keys.length > 0) {
        // Convert to array by sorting keys numerically and mapping
        return keys
          .map(Number)
          .sort((a, b) => a - b)
          .map(key => obj[String(key)]);
      }
    }
    return [];
  };

  useEffect(() => {
    // Handle shipping_price which is a number, not an object
    if (config.config_key === 'shipping_price') {
      setFormData(config.config_value || 0);
    } else if (config.config_key === 'preorder_discount') {
      setFormData({
        enabled: config.config_value?.enabled ?? true,
        percent: config.config_value?.percent ?? 15,
      });
    } else if (config.config_key === 'testimonials' || config.config_key === 'preorder_benefits') {
      // Ensure these are always arrays, converting from object if needed
      const value = config.config_value;
      if (Array.isArray(value)) {
        setFormData(value);
      } else {
        // Try to convert object to array
        const converted = objectToArray(value);
        setFormData(converted.length > 0 ? converted : []);
      }
    } else {
      const value = config.config_value || {};
      if (config.config_key === 'book_info') {
        const previousBooks = Array.isArray(value.previousBooks) && value.previousBooks.length > 0
          ? value.previousBooks
          : value.previousBook
            ? [{ title: value.previousBook, url: value.previousBookUrl || '' }]
            : [];
        setFormData({ ...value, previousBooks });
      } else {
        setFormData(value);
      }
    }
  }, [config]);

  const handleSave = async () => {
    try {
      setError(null);
      setSaving(true);
      
      let dataToSave: any;
      
      // Handle array types (testimonials, preorder_benefits)
      if (config.config_key === 'testimonials' || config.config_key === 'preorder_benefits') {
        dataToSave = Array.isArray(formData) ? formData : [];
      } else if (config.config_key === 'preorder_discount') {
        dataToSave = normalizePreorderDiscount(formData);
      } else if (config.config_key === 'book_info') {
        const { formats: _legacyFormats, previousBook: _legacyPreviousBook, previousBookUrl: _legacyPreviousBookUrl, ...bookInfo } = formData;
        dataToSave = {
          ...bookInfo,
          previousBooks: Array.isArray(bookInfo.previousBooks)
            ? bookInfo.previousBooks.filter((book: { title?: string }) => book?.title?.trim())
            : [],
        };
      } else {
        dataToSave = formData;
      }
      
      await onSave(config.config_key, dataToSave, config.description);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const renderFormFields = () => {
    switch (config.config_key) {
      case 'book_info':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter book title"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author || ''}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre || ''}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                placeholder="e.g., Memoir • Biography • History"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter book description"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                value={formData.releaseDate || ''}
                onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                placeholder="e.g., December 2025"
              />
            </div>
            <div>
              <Label htmlFor="preorderBonus">Preorder Bonus</Label>
              <Input
                id="preorderBonus"
                value={formData.preorderBonus || ''}
                onChange={(e) => setFormData({...formData, preorderBonus: e.target.value})}
                placeholder="e.g., Preorder now and get a signed copy!"
              />
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="bonusMaterialEnabled" className="font-medium">
                    Show bonus material
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Displays the bonus badge on the book cover and enables the bonuses page.
                  </p>
                </div>
                <Switch
                  id="bonusMaterialEnabled"
                  checked={formData.bonusMaterialEnabled !== false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, bonusMaterialEnabled: checked })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="series">Series</Label>
              <Input
                id="series"
                value={formData.series || ''}
                onChange={(e) => setFormData({...formData, series: e.target.value})}
                placeholder="e.g., Memoir Series"
              />
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Previous Books in the Series</h3>
              <p className="text-sm text-gray-500 mb-3">
                Shown on the homepage as Book 1, Book 2, and so on.
              </p>
              <div className="space-y-3">
                {(Array.isArray(formData.previousBooks) ? formData.previousBooks : []).map((book: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Book {index + 1}</p>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={book.title || ''}
                          onChange={(e) => {
                            const books = Array.isArray(formData.previousBooks) ? [...formData.previousBooks] : [];
                            books[index] = { ...book, title: e.target.value };
                            setFormData({ ...formData, previousBooks: books });
                          }}
                          placeholder="Book title"
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={book.url || ''}
                          onChange={(e) => {
                            const books = Array.isArray(formData.previousBooks) ? [...formData.previousBooks] : [];
                            books[index] = { ...book, url: e.target.value };
                            setFormData({ ...formData, previousBooks: books });
                          }}
                          placeholder="https://a.co/d/623YZo9"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const books = Array.isArray(formData.previousBooks) ? [...formData.previousBooks] : [];
                          setFormData({
                            ...formData,
                            previousBooks: books.filter((_: any, i: number) => i !== index),
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const books = Array.isArray(formData.previousBooks) ? formData.previousBooks : [];
                    setFormData({
                      ...formData,
                      previousBooks: [...books, { title: '', url: '' }],
                    });
                  }}
                >
                  Add Book
                </Button>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Additional Information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="coverImage">Cover Image Path</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                    placeholder="e.g., /images/bookImage.png"
                  />
                </div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                  <p className="text-sm text-gray-600">
                    Available formats shown on the site are managed in{' '}
                    <strong>Book Formats &amp; Pricing</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'author_info':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Author Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Enter author biography"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-1">Line breaks are preserved on the site.</p>
            </div>
            <div>
              <Label htmlFor="personalNote">Personal Note</Label>
              <Textarea
                id="personalNote"
                value={formData.personalNote || ''}
                onChange={(e) => setFormData({...formData, personalNote: e.target.value})}
                placeholder="Enter personal note"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Supports basic HTML (e.g. &lt;strong&gt;) and line breaks.
              </p>
            </div>
            <div>
              <Label htmlFor="quote">Quote</Label>
              <Textarea
                id="quote"
                value={formData.quote || ''}
                onChange={(e) => setFormData({...formData, quote: e.target.value})}
                placeholder="Enter author quote"
                rows={2}
              />
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Previous Works</h3>
              {Array.isArray(formData.previousWorks) && formData.previousWorks.map((work: any, index: number) => (
                <Card key={index} className="p-4 mb-3">
                  <div className="space-y-3">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={work.title || ''}
                        onChange={(e) => {
                          const currentWorks = Array.isArray(formData.previousWorks) ? formData.previousWorks : [];
                          const newWorks = [...currentWorks];
                          newWorks[index] = {...work, title: e.target.value};
                          setFormData({...formData, previousWorks: newWorks});
                        }}
                        placeholder="Book title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Year</Label>
                        <Input
                          value={work.year || ''}
                          onChange={(e) => {
                            const currentWorks = Array.isArray(formData.previousWorks) ? formData.previousWorks : [];
                            const newWorks = [...currentWorks];
                            newWorks[index] = {...work, year: e.target.value};
                            setFormData({...formData, previousWorks: newWorks});
                          }}
                          placeholder="e.g., 2023"
                        />
                      </div>
                      <div>
                        <Label>Achievement</Label>
                        <Input
                          value={work.achievement || ''}
                          onChange={(e) => {
                            const currentWorks = Array.isArray(formData.previousWorks) ? formData.previousWorks : [];
                            const newWorks = [...currentWorks];
                            newWorks[index] = {...work, achievement: e.target.value};
                            setFormData({...formData, previousWorks: newWorks});
                          }}
                          placeholder="e.g., First Book in Memoir Series"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={work.url || ''}
                        onChange={(e) => {
                          const currentWorks = Array.isArray(formData.previousWorks) ? formData.previousWorks : [];
                          const newWorks = [...currentWorks];
                          newWorks[index] = {...work, url: e.target.value};
                          setFormData({...formData, previousWorks: newWorks});
                        }}
                        placeholder="https://a.co/d/623YZo9"
                      />
                    </div>
                  </div>
                </Card>
              ))}
              {(!Array.isArray(formData.previousWorks) || formData.previousWorks.length === 0) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentWorks = Array.isArray(formData.previousWorks) ? formData.previousWorks : [];
                    setFormData({
                      ...formData,
                      previousWorks: [...currentWorks, { title: '', year: '', achievement: '', url: '' }]
                    });
                  }}
                >
                  Add Previous Work
                </Button>
              )}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            {Array.isArray(formData) && formData.map((testimonial: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label>Quote {index + 1}</Label>
                    <Textarea
                      value={testimonial.quote || ''}
                      onChange={(e) => {
                        const currentData = Array.isArray(formData) ? formData : [];
                        const newData = [...currentData];
                        newData[index] = {...testimonial, quote: e.target.value};
                        setFormData(newData);
                      }}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={testimonial.author || ''}
                        onChange={(e) => {
                          const currentData = Array.isArray(formData) ? formData : [];
                          const newData = [...currentData];
                          newData[index] = {...testimonial, author: e.target.value};
                          setFormData(newData);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={testimonial.role || ''}
                        onChange={(e) => {
                          const currentData = Array.isArray(formData) ? formData : [];
                          const newData = [...currentData];
                          newData[index] = {...testimonial, role: e.target.value};
                          setFormData(newData);
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove this testimonial? This action cannot be undone.`)) {
                        const currentData = Array.isArray(formData) ? formData : [];
                        const newData = currentData.filter((_: any, i: number) => i !== index);
                        setFormData(newData);
                      }
                    }}
                  >
                    Remove Testimonial
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentData = Array.isArray(formData) ? formData : [];
                setFormData([...currentData, { quote: '', author: '', role: '' }]);
              }}
            >
              Add Testimonial
            </Button>
          </div>
        );

      case 'preorder_benefits':
        return (
          <div className="space-y-4">
            {Array.isArray(formData) && formData.map((benefit: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => {
                    const currentData = Array.isArray(formData) ? formData : [];
                    const newData = [...currentData];
                    newData[index] = e.target.value;
                    setFormData(newData);
                  }}
                  placeholder="Enter benefit"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove this preorder benefit? This action cannot be undone.`)) {
                      const currentData = Array.isArray(formData) ? formData : [];
                      const newData = currentData.filter((_: any, i: number) => i !== index);
                      setFormData(newData);
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentData = Array.isArray(formData) ? formData : [];
                setFormData([...currentData, '']);
              }}
            >
              Add Benefit
            </Button>
          </div>
        );

      case 'book_formats':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Book Format Pricing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Format keys should match the format type (e.g., "paperback", "hardcover"). Use lowercase, no spaces.
            </p>
            {Object.entries(formData).map(([formatKey, formatData]: [string, any]) => (
              <Card key={formatKey} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor={`key-${formatKey}`} className="text-sm font-medium text-gray-700">Format Key (Identifier)</Label>
                      <Input
                        key={`input-${formatKey}`}
                        id={`key-${formatKey}`}
                        defaultValue={formatKey}
                        onBlur={(e) => {
                          const newKey = e.target.value.toLowerCase().trim().replace(/\s+/g, '_');
                          if (newKey !== formatKey && newKey !== '') {
                            if (formData[newKey] && newKey !== formatKey) {
                              alert(`Format key "${newKey}" already exists. Please use a different key.`);
                              return;
                            }
                            // Rename the key by creating new object with new key
                            const newData = { ...formData };
                            delete newData[formatKey];
                            newData[newKey] = formatData;
                            setFormData(newData);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                        placeholder="e.g., paperback"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This is the key used in orders. Use: paperback, hardcover, ebook, or audiobook. Press Enter or click away to save.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove the "${formatData.name || formatKey}" format? This action cannot be undone.`)) {
                          const newData = { ...formData };
                          delete newData[formatKey];
                          setFormData(newData);
                        }
                      }}
                    >
                      Remove Format
                    </Button>
                  </div>
                  <div>
                    <Label>Format Name (Display Name)</Label>
                    <Input
                      value={formatData.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        [formatKey]: {...formatData, name: e.target.value}
                      })}
                      placeholder="e.g., Paperback"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This is the name shown to customers
                    </p>
                  </div>
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formatData.price || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        [formatKey]: {...formatData, price: parseFloat(e.target.value) || 0}
                      })}
                      placeholder="24.99"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formatData.description || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        [formatKey]: {...formatData, description: e.target.value}
                      })}
                      placeholder="e.g., Premium paperback edition"
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newKey = `format_${Date.now()}`;
                setFormData({
                  ...formData,
                  [newKey]: {
                    name: '',
                    price: 0,
                    description: ''
                  }
                });
              }}
            >
              Add New Format
            </Button>
          </div>
        );


      case 'preorder_stats':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Preorder Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Early Preorders</Label>
                <Input
                  value={formData.earlyPreorders || ''}
                  onChange={(e) => setFormData({...formData, earlyPreorders: e.target.value})}
                  placeholder="500+"
                />
              </div>
              <div>
                <Label>Rating</Label>
                <Input
                  value={formData.rating || ''}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  placeholder="4.9/5"
                />
              </div>
              <div>
                <Label>Countries</Label>
                <Input
                  value={formData.countries || ''}
                  onChange={(e) => setFormData({...formData, countries: e.target.value})}
                  placeholder="50+"
                />
              </div>
            </div>
          </div>
        );

      case 'shipping_price':
        // Ensure we have a valid number
        const shippingValue = typeof formData === 'number' 
          ? formData 
          : (typeof formData === 'object' && formData !== null ? 0 : (parseFloat(String(formData)) || 0));
        
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shipping_price">Shipping Price ($)</Label>
              <Input
                id="shipping_price"
                type="number"
                step="0.01"
                min="0"
                value={shippingValue}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData(value);
                }}
                placeholder="0.00"
              />
              <p className="text-sm text-gray-500 mt-2">
                Set the shipping price for physical book orders. Enter 0.00 for free shipping.
                Digital products (ebook, audiobook) will always show free shipping regardless of this setting.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Current shipping price:</strong> ${shippingValue.toFixed(2)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This will be applied to all physical book formats (hardcover, paperback) in the checkout.
                </p>
              </div>
            </div>
          </div>
        );

      case 'preorder_discount': {
        const discountEnabled = formData?.enabled ?? true;
        const discountPercent = typeof formData?.percent === 'number' ? formData.percent : 15;

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <Label htmlFor="discount_enabled">Discount Enabled</Label>
                <p className="text-sm text-gray-500 mt-1">
                  When off, customers pay the full list price from Book Formats &amp; Pricing.
                </p>
              </div>
              <Switch
                id="discount_enabled"
                checked={discountEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
            </div>
            <div>
              <Label htmlFor="discount_percent">Discount Percentage</Label>
              <Input
                id="discount_percent"
                type="number"
                min="0"
                max="100"
                step="1"
                value={discountPercent}
                disabled={!discountEnabled}
                onChange={(e) => {
                  const value = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                  setFormData({ ...formData, percent: value });
                }}
                placeholder="15"
              />
              <p className="text-sm text-gray-500 mt-2">
                Percentage off the list price at checkout. Applies to all book formats.
                Bundle prices are set in Book Formats &amp; Pricing; this percentage controls the savings shown and applied at checkout.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Preview:</strong>{' '}
                {discountEnabled
                  ? `${discountPercent}% off list price at checkout`
                  : 'No discount — full list price charged'}
              </p>
            </div>
          </div>
        );
      }

      case 'site_config':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Textarea
                id="tagline"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                placeholder="Enter site tagline"
                rows={3}
              />
            </div>
            <div>
              <Label>Social Links</Label>
              <p className="text-sm text-gray-500 mb-3">
                Turn off a platform to hide it from the footer until you have an account.
              </p>
              <div className="space-y-4">
                {SOCIAL_PLATFORMS.map(({ key, label }) => {
                  const enabled = formData.socialLinksEnabled?.[key] !== false;
                  return (
                    <div key={key} className="rounded-lg border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <Label htmlFor={`${key}-enabled`} className="font-medium">
                          Show {label} in footer
                        </Label>
                        <Switch
                          id={`${key}-enabled`}
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              socialLinksEnabled: {
                                ...formData.socialLinksEnabled,
                                [key]: checked,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={key}>{label} URL</Label>
                        <Input
                          id={key}
                          value={formData.socialLinks?.[key] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              socialLinks: { ...formData.socialLinks, [key]: e.target.value },
                            })
                          }
                          placeholder={`${label} URL`}
                          disabled={!enabled}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Configuration Value (JSON)</Label>
              <Textarea
                value={JSON.stringify(formData, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, keep the text
                  }
                }}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Edit the JSON directly for this configuration type
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Edit Configuration</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{config.category}</Badge>
                <span className="text-sm text-gray-500">{config.config_key}</span>
              </div>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {renderFormFields()}
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
