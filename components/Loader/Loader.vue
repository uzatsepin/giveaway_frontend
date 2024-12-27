<template>
    <div :class="cn('inline-flex items-center justify-center', className)">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            :width="width" 
            :height="height" 
            viewBox="0 0 24 24"
            :class="cn('animate-spin', sizeClass)"
        >
            <path fill="#6734ff" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25" />
            <path fill="#6734ff" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                <animateTransform 
                    attributeName="transform" 
                    dur="0.75s" 
                    repeatCount="indefinite" 
                    type="rotate" 
                    values="0 12 12;360 12 12" 
                />
            </path>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    width?: number;
    height?: number;
    className?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    width: undefined,
    height: undefined,
    className: ''
});

const sizeClass = computed(() => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-24 h24',
        '2xl': 'w-32 h-32',
    };
    return props.width || props.height ? '' : sizes[props.size];
});
</script>