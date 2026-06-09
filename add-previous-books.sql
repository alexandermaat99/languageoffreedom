-- Update book_info to use previousBooks array (Book 1 and Book 2)
UPDATE public.site_config
SET config_value = config_value
  - 'previousBook'
  - 'previousBookUrl'
  || jsonb_build_object(
    'previousBooks',
    jsonb_build_array(
      jsonb_build_object(
        'title', 'Before I Became a Refugee Girl: Life in Laos During the Vietnam War Era',
        'url', 'https://a.co/d/075qRbIz'
      ),
      jsonb_build_object(
        'title', 'Waiting to Fly: A Laotian Refugee Girl''s Journey in Nong Khai',
        'url', 'https://a.co/d/0hv9Ml4D'
      )
    )
  ),
  updated_at = now()
WHERE config_key = 'book_info';
