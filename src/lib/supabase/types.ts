// Generado manualmente para coincidir con el schema de Fase 2.
// Regenerar con: pnpm supabase gen types typescript --linked > src/lib/supabase/types.ts
// (requiere: SUPABASE_ACCESS_TOKEN en .env.local + pnpm supabase link --project-ref <ref>)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_path: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_path?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_path?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          attributes: Json
          status: Database['public']['Enums']['product_status']
          is_placeholder: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          attributes?: Json
          status?: Database['public']['Enums']['product_status']
          is_placeholder?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          attributes?: Json
          status?: Database['public']['Enums']['product_status']
          is_placeholder?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string
          price_cents: number
          compare_at_price_cents: number | null
          stock: number
          weight_grams: number | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          sku: string
          price_cents: number
          compare_at_price_cents?: number | null
          stock?: number
          weight_grams?: number | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          sku?: string
          price_cents?: number
          compare_at_price_cents?: number | null
          stock?: number
          weight_grams?: number | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          storage_path: string
          alt_text: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          storage_path: string
          alt_text?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          storage_path?: string
          alt_text?: string | null
          position?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipping_methods: {
        Row: {
          id: string
          name: string
          type: Database['public']['Enums']['shipping_method_type']
          is_active: boolean
          zones: Json
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: Database['public']['Enums']['shipping_method_type']
          is_active?: boolean
          zones?: Json
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: Database['public']['Enums']['shipping_method_type']
          is_active?: boolean
          zones?: Json
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string | null
          access_token: string
          user_id: string | null
          status: Database['public']['Enums']['order_status']
          payment_status: Database['public']['Enums']['payment_status']
          first_name: string
          last_name: string
          email: string
          phone: string
          shipping_method_id: string | null
          shipping_type: Database['public']['Enums']['shipping_method_type']
          shipping_address: Json | null
          shipping_notes: string | null
          subtotal_cents: number
          shipping_cents: number
          total_cents: number
          age_verified: boolean
          mp_preference_id: string | null
          mp_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string | null
          access_token?: string
          user_id?: string | null
          status?: Database['public']['Enums']['order_status']
          payment_status?: Database['public']['Enums']['payment_status']
          first_name: string
          last_name: string
          email: string
          phone: string
          shipping_method_id?: string | null
          shipping_type: Database['public']['Enums']['shipping_method_type']
          shipping_address?: Json | null
          shipping_notes?: string | null
          subtotal_cents: number
          shipping_cents?: number
          total_cents: number
          age_verified?: boolean
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string | null
          access_token?: string
          user_id?: string | null
          status?: Database['public']['Enums']['order_status']
          payment_status?: Database['public']['Enums']['payment_status']
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          shipping_method_id?: string | null
          shipping_type?: Database['public']['Enums']['shipping_method_type']
          shipping_address?: Json | null
          shipping_notes?: string | null
          subtotal_cents?: number
          shipping_cents?: number
          total_cents?: number
          age_verified?: boolean
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_shipping_method_id_fkey'
            columns: ['shipping_method_id']
            isOneToOne: false
            referencedRelation: 'shipping_methods'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          variant_name: string
          sku: string
          quantity: number
          unit_price_cents: number
          subtotal_cents: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name: string
          variant_name: string
          sku: string
          quantity: number
          unit_price_cents: number
          subtotal_cents: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          product_name?: string
          variant_name?: string
          sku?: string
          quantity?: number
          unit_price_cents?: number
          subtotal_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: Database['public']['Enums']['order_status']
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: Database['public']['Enums']['order_status']
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: Database['public']['Enums']['order_status']
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_status_history_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string
          provider: string
          provider_payment_id: string | null
          amount_cents: number | null
          status: Database['public']['Enums']['payment_status']
          raw_response: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          provider?: string
          provider_payment_id?: string | null
          amount_cents?: number | null
          status?: Database['public']['Enums']['payment_status']
          raw_response?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          provider?: string
          provider_payment_id?: string | null
          amount_cents?: number | null
          status?: Database['public']['Enums']['payment_status']
          raw_response?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      content_blocks: {
        Row: {
          id: string
          key: string
          type: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          type: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          type?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      decrement_stock: {
        Args: {
          p_variant_id: string
          p_quantity: number
        }
        Returns: undefined
      }
    }
    Enums: {
      order_status:
        | 'pending'
        | 'confirmed'
        | 'preparing'
        | 'shipped'
        | 'ready_for_pickup'
        | 'delivered'
        | 'cancelled'
      payment_status: 'pending' | 'approved' | 'rejected' | 'refunded'
      product_status: 'draft' | 'published' | 'archived'
      shipping_method_type: 'delivery' | 'pickup' | 'theater_pickup'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ─────────────────────────────────────────
// Helpers para usar con el cliente Supabase tipado
// ─────────────────────────────────────────

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
