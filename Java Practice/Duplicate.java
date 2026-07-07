class Solution {
    public int removeDuplicates(int[] nums) {
        int j=0;
        for(int i=1;i<nums.length;i++)
        {
            if(nums[i]!=nums[j])
            {
                j++;
                nums[j]=nums[i];
            }
        }
        return j+1;
    }
}
class Duplicate
{
    public static void main(String[] args) 
    {
        Solution obj1=new Solution();
        int[] nums={0,0,1,1,1,2,2,3,3,4};
        System.out.println(obj1.removeDuplicates(nums));
    }
}