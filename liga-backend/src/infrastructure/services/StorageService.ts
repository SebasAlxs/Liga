import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class StorageService {
    private supabase: SupabaseClient;
    private bucket = process.env.SUPABASE_BUCKET || 'players';

    constructor() {
        const url = process.env.SUPABASE_URL || '';
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
        
        if (!url || !key) {
            console.warn("⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env");
        }
        
        this.supabase = createClient(url || 'https://vmxeunadwboozcbouuxe.supabase.co', key || 'dummy_key');
    }

    async uploadImage(base64: string, filename: string, folder?: string): Promise<string> {
        if (!base64) return "";
        if (base64.startsWith('http')) return base64; // already a URL

        try {
            // Strip data:image/... base64 prefix if exists
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');

            const finalFilename = folder ? `${folder}/${filename}` : filename;

            const { data, error } = await this.supabase.storage
                .from(this.bucket)
                .upload(finalFilename, buffer, {
                    contentType: 'image/jpeg', // Defaulting to jpeg
                    upsert: true
                });

            if (error) {
                console.error("Storage upload error:", error);
                throw new Error(`Failed to upload image: ${error.message}`);
            }

            const { data: publicUrlData } = this.supabase.storage
                .from(this.bucket)
                .getPublicUrl(finalFilename);

            return publicUrlData.publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    }
}
