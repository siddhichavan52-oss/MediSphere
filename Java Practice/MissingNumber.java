class Solution {
    public int missingNumber(int[] nums) 
    {
        int n=nums.length;
        int sum=n*(n+1)/2;
        int s=0;
        for(int i=0;i<n;i++)
        {
            s=s+nums[i];
        }
        return sum-s;
    }
}
class MissingNumber
{
    public static void main(String[] args) 
    {
        Solution obj1=new Solution();
        int[] nums={3,0,1};
        System.out.println(obj1.missingNumber(nums));
    }
}